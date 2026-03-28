import { vi } from 'vitest';

import { mockUser, mockAdmin } from '../user/mocks.js';
import { IAuthRepository } from './repository.js';

export const mockAuthRepository = {
  findByEmail: vi.fn(),
  findByEmailWithPassword: vi.fn(),
  countUsers: vi.fn(),
  countByEmail: vi.fn(),
  createUser: vi.fn(),
  updateByEmail: vi.fn(),
  updateById: vi.fn(),
  saveUser: vi.fn(),
} satisfies IAuthRepository;

export const mockAuthUser = {
  ...mockUser,
  password: '$2a$10$hashedpassword',
  passwordTemporary: '',
  isEmailConfirmed: true,
  confirmationToken: '',
};

export const mockUnconfirmedUser = {
  ...mockUser,
  password: '$2a$10$hashedpassword',
  passwordTemporary: '',
  isEmailConfirmed: false,
  confirmationToken: 'test-confirm-token',
};

export const mockResetPasswordUser = {
  ...mockUser,
  password: '$2a$10$hashedpassword',
  passwordTemporary: '$2a$10$hashedtemporary',
  isResetPassword: true,
  isEmailConfirmed: true,
  confirmationToken: '',
};

export const mockAdminWithPassword = {
  ...mockAdmin,
  password: '$2a$10$hashedpassword',
  passwordTemporary: '',
  isEmailConfirmed: true,
  confirmationToken: '',
};

export const mockEmail = 'test@example.com';
export const mockPassword = 'password123';
export const mockToken = 'test-token';
export const mockSign = vi.fn(() => 'mock-jwt-token');
