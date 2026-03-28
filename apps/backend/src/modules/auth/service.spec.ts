import bcrypt from 'bcryptjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockUser } from '../user/mocks.js';
import {
  mockAuthRepository,
  mockAuthUser,
  mockUnconfirmedUser,
  mockResetPasswordUser,
  mockAdminWithPassword,
  mockEmail,
  mockPassword,
  mockToken,
  mockSign,
} from './mocks.js';
import { AUTH_TEXTS } from './constants.js';
import { createAuthService } from './service.js';

vi.mock('../common/helpers.js', () => ({
  sendMail: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
  compare: vi.fn(),
  hash: vi.fn(),
}));

vi.mock('mhz-helpers', () => ({
  generatePassword: vi.fn(() => 'generatedPassword123'),
}));

const service = createAuthService({ authRepository: mockAuthRepository });

beforeEach(() => {
  vi.resetAllMocks();
});

describe('createAuthService', () => {
  describe('check', () => {
    it('returns filtered user data when user exists', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(mockAuthUser);

      const result = await service.check(mockUser);

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toHaveProperty('email', mockUser.email);
      expect(result).toHaveProperty('name', mockUser.name);
    });

    it('throws not found when user does not exist', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(service.check(mockUser)).rejects.toThrow('Not found');
    });
  });

  describe('login', () => {
    it('returns user and token on successful login', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(mockAuthUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const result = await service.login({ email: mockEmail, password: mockPassword }, mockSign);

      expect(mockAuthRepository.findByEmailWithPassword).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockAuthUser.password);
      expect(mockSign).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(mockAuthRepository.saveUser).toHaveBeenCalled();
    });

    it('handles password reset flow with valid main password', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(mockResetPasswordUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const result = await service.login({ email: mockEmail, password: mockPassword }, mockSign);

      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockResetPasswordUser.password);
      expect(result).toHaveProperty('token');
      expect(mockResetPasswordUser.isResetPassword).toBe(false);
      expect(mockResetPasswordUser.passwordTemporary).toBe('');
    });

    it('throws not found when user has no password', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue({ ...mockAuthUser, password: null });

      await expect(service.login({ email: mockEmail, password: mockPassword }, mockSign)).rejects.toThrow('Not found');
    });

    it('throws not found when user does not exist', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login({ email: mockEmail, password: mockPassword }, mockSign)).rejects.toThrow('Not found');
    });

    it('throws unauthorized on invalid password', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(mockAuthUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      await expect(service.login({ email: mockEmail, password: 'wrong' }, mockSign)).rejects.toThrow('Unauthorized');
    });

    it('throws unauthorized when email not confirmed and role is not admin', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(mockUnconfirmedUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      await expect(service.login({ email: mockEmail, password: mockPassword }, mockSign)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('allows login for unconfirmed admin', async () => {
      const unconfirmedAdmin = { ...mockAdminWithPassword, isEmailConfirmed: false };

      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(unconfirmedAdmin);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const result = await service.login({ email: mockEmail, password: mockPassword }, mockSign);

      expect(result).toHaveProperty('token');
    });

    it('updates dateLoggedIn on successful login', async () => {
      mockAuthRepository.findByEmailWithPassword.mockResolvedValue(mockAuthUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      await service.login({ email: mockEmail, password: mockPassword }, mockSign);

      expect(mockAuthUser.dateLoggedIn).toBeInstanceOf(Date);
      expect(mockAuthRepository.saveUser).toHaveBeenCalledWith(mockAuthUser);
    });
  });

  describe('setup', () => {
    it('creates admin user when no users exist', async () => {
      mockAuthRepository.countUsers.mockResolvedValue(0);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-password');

      await service.setup({ email: mockEmail, password: mockPassword });

      expect(mockAuthRepository.countUsers).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith({
        email: mockEmail,
        password: 'hashed-password',
        isEmailConfirmed: true,
        role: 'admin',
      });
    });

    it('throws conflict when users already exist', async () => {
      mockAuthRepository.countUsers.mockResolvedValue(1);

      await expect(service.setup({ email: mockEmail, password: mockPassword })).rejects.toThrow('Already exists');
    });
  });

  describe('register', () => {
    it('creates user and sends confirmation email with English text', async () => {
      const { sendMail } = await import('../common/helpers.js');

      mockAuthRepository.countByEmail.mockResolvedValue(0);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-password');
      mockSign.mockReturnValue('confirm-token');

      const registerData = { email: mockEmail, password: mockPassword, name: 'Test User' };

      await service.register(registerData, 'en', mockSign);

      expect(mockAuthRepository.countByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(mockSign).toHaveBeenCalled();
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith({
        email: mockEmail,
        name: 'Test User',
        password: 'hashed-password',
        confirmationToken: 'confirm-token',
        role: 'user',
      });

      expect(sendMail).toHaveBeenCalledWith(expect.stringContaining(AUTH_TEXTS.register.en), mockEmail);
    });

    it('throws conflict when email already registered', async () => {
      mockAuthRepository.countByEmail.mockResolvedValue(1);

      const registerData = { email: mockEmail, password: mockPassword, name: 'Test User' };

      await expect(service.register(registerData, 'en', mockSign)).rejects.toThrow('Already exists');
    });

    it('sends Russian email text when lang is ru', async () => {
      const { sendMail } = await import('../common/helpers.js');

      mockAuthRepository.countByEmail.mockResolvedValue(0);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-password');
      mockSign.mockReturnValue('confirm-token');

      const registerData = { email: mockEmail, password: mockPassword, name: 'Test User' };

      await service.register(registerData, 'ru', mockSign);

      expect(mockAuthRepository.createUser).toHaveBeenCalled();

      expect(sendMail).toHaveBeenCalledWith(expect.stringContaining(AUTH_TEXTS.register.ru), mockEmail);
    });
  });

  describe('confirm', () => {
    it('updates user email confirmation status', async () => {
      const mockDecode = vi.fn().mockReturnValue({ email: mockEmail });

      await service.confirm(mockToken, mockDecode);

      expect(mockAuthRepository.updateByEmail).toHaveBeenCalledWith(
        { email: mockEmail, isEmailConfirmed: false, confirmationToken: mockToken },
        { isEmailConfirmed: true, confirmationToken: '', dateUpdated: expect.any(Date) }
      );
    });

    it('throws bad request when token is invalid', async () => {
      const mockDecode = vi.fn().mockReturnValue(null);

      await expect(service.confirm(mockToken, mockDecode)).rejects.toThrow('Bad request');
    });
  });

  describe('reset', () => {
    it('resets password and sends email with English text', async () => {
      const { sendMail } = await import('../common/helpers.js');

      mockAuthRepository.findByEmail.mockResolvedValue(mockAuthUser);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-new-password');

      await service.reset(mockEmail, 'en');

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockAuthRepository.updateById).toHaveBeenCalledWith(mockAuthUser._id, {
        passwordTemporary: 'hashed-new-password',
        isResetPassword: true,
        dateUpdated: expect.any(Date),
      });

      expect(sendMail).toHaveBeenCalledWith(expect.stringContaining(AUTH_TEXTS.reset.en), mockEmail);
    });

    it('throws not found when user does not exist', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(service.reset(mockEmail, 'en')).rejects.toThrow('Not found');
    });

    it('sends Russian email text when lang is ru', async () => {
      const { sendMail } = await import('../common/helpers.js');

      mockAuthRepository.findByEmail.mockResolvedValue(mockAuthUser);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed-new-password');

      await service.reset(mockEmail, 'ru');

      expect(mockAuthRepository.updateById).toHaveBeenCalled();

      expect(sendMail).toHaveBeenCalledWith(expect.stringContaining(AUTH_TEXTS.reset.ru), mockEmail);
    });
  });
});
