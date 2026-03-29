import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

import { testAccessDeniedScenario } from '../common/test/testHelpers.ts';
import { mockUser, mockAdmin, userId, otherUserId, mockUserRepository } from './mocks.ts';
import { createUserService } from './service.ts';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock('../common/helpers.ts', () => ({
  checkInvalidId: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock('../auth/helpers.ts', () => ({
  allowAccessToAdminAndCurrentUser: vi.fn(),
}));

vi.mock('../common/errorHandler.ts', () => ({
  error: {
    notFound: () => new Error('Not found'),
    forbidden: () => new Error('Access denied'),
    badRequest: () => new Error('Bad request'),
    internal: () => new Error('Internal server error'),
  },
}));

const { checkInvalidId, sendMail } = await import('../common/helpers.ts');
const { allowAccessToAdminAndCurrentUser } = await import('../auth/helpers.ts');

const service = createUserService({
  userRepository: mockUserRepository,
});

beforeEach(() => {
  vi.clearAllMocks();
  (checkInvalidId as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
  (allowAccessToAdminAndCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
  (sendMail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue('hashed_password');
});

describe('createUserService', () => {
  describe('getMany', () => {
    it('returns users with pagination', async () => {
      const mockData = { data: [mockUser], total: 1 };

      mockUserRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany(1);

      expect(mockUserRepository.getMany).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });

    it('handles undefined page parameter', async () => {
      const mockData = { data: [mockUser], total: 1 };

      mockUserRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany();

      expect(mockUserRepository.getMany).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getOne', () => {
    it('returns user successfully', async () => {
      mockUserRepository.getOne.mockResolvedValue(mockUser);

      const result = await service.getOne(userId);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.getOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ data: mockUser });
    });

    it('throws not found when user does not exist', async () => {
      mockUserRepository.getOne.mockResolvedValue(null);

      await expect(service.getOne(userId)).rejects.toThrow('Not found');
    });

    it('throws bad request for invalid id', async () => {
      (checkInvalidId as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Bad request');
      });

      await expect(service.getOne('invalid-id')).rejects.toThrow('Bad request');
    });
  });

  describe('create', () => {
    it('creates user successfully', async () => {
      const hashedPassword = 'hashed_password';
      const userToCreate = { ...mockUser, password: 'password123' };

      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(undefined);

      await service.create(userToCreate);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userToCreate,
        password: hashedPassword,
      });
    });

    it('throws internal error when password is missing', async () => {
      const userToCreate = { ...mockUser, password: undefined };

      await expect(service.create(userToCreate)).rejects.toThrow('Internal server error');
    });
  });

  describe('update', () => {
    it('updates user successfully for owner', async () => {
      mockUserRepository.updateOne.mockResolvedValue(undefined);

      await service.update(userId, mockUser, mockUser);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockUser);
      expect(mockUserRepository.updateOne).toHaveBeenCalledWith(userId, mockUser);
    });

    it('updates user successfully for admin', async () => {
      mockUserRepository.updateOne.mockResolvedValue(undefined);

      await service.update(userId, mockUser, mockAdmin);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockAdmin);
      expect(mockUserRepository.updateOne).toHaveBeenCalledWith(userId, mockUser);
    });

    testAccessDeniedScenario({
      setupMocks: () => {
        (allowAccessToAdminAndCurrentUser as ReturnType<typeof vi.fn>).mockImplementation(() => {
          throw new Error('Access denied');
        });
      },
      serviceMethod: service.update,
      mockRepository: mockUserRepository,
      args: [otherUserId, mockUser, mockUser],
    });

    it('throws bad request for invalid id', async () => {
      (checkInvalidId as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Bad request');
      });

      await expect(service.update('invalid-id', mockUser, mockUser)).rejects.toThrow('Bad request');
    });
  });

  describe('updatePassword', () => {
    it('updates password successfully for owner', async () => {
      const hashedPassword = 'hashed_new_password';

      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue(hashedPassword);
      mockUserRepository.updatePassword.mockResolvedValue(undefined);

      await service.updatePassword(userId, 'newPassword123', mockUser);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(userId, hashedPassword);
    });

    it('updates password successfully for admin', async () => {
      const hashedPassword = 'hashed_new_password';

      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue(hashedPassword);
      mockUserRepository.updatePassword.mockResolvedValue(undefined);

      await service.updatePassword(userId, 'newPassword123', mockAdmin);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockAdmin);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(userId, hashedPassword);
    });

    testAccessDeniedScenario({
      setupMocks: () => {
        (allowAccessToAdminAndCurrentUser as ReturnType<typeof vi.fn>).mockImplementation(() => {
          throw new Error('Access denied');
        });
      },
      serviceMethod: service.updatePassword,
      mockRepository: mockUserRepository,
      args: [otherUserId, 'newPassword123', mockUser],
    });

    it('throws bad request for invalid id', async () => {
      (checkInvalidId as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Bad request');
      });

      await expect(service.updatePassword('invalid-id', 'newPassword123', mockUser)).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('deletes user successfully for owner', async () => {
      mockUserRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete(userId, mockUser);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockUser);
      expect(mockUserRepository.deleteOne).toHaveBeenCalledWith(userId);
    });

    it('deletes user successfully for admin', async () => {
      mockUserRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete(userId, mockAdmin);

      expect(checkInvalidId).toHaveBeenCalledWith(userId);
      expect(allowAccessToAdminAndCurrentUser).toHaveBeenCalledWith(userId, mockAdmin);
      expect(mockUserRepository.deleteOne).toHaveBeenCalledWith(userId);
    });

    testAccessDeniedScenario({
      setupMocks: () => {
        (allowAccessToAdminAndCurrentUser as ReturnType<typeof vi.fn>).mockImplementation(() => {
          throw new Error('Access denied');
        });
      },
      serviceMethod: service.delete,
      mockRepository: mockUserRepository,
      args: [otherUserId, mockUser],
    });

    it('throws bad request for invalid id', async () => {
      (checkInvalidId as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Bad request');
      });

      await expect(service.delete('invalid-id', mockUser)).rejects.toThrow('Bad request');
    });
  });

  describe('feedback', () => {
    it('sends feedback email successfully', async () => {
      const feedback = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Great app!',
      };

      (sendMail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      await service.feedback(feedback);

      expect(sendMail).toHaveBeenCalledWith(
        `Обратная связь от пользователя ${feedback.name} (${feedback.email}): ${feedback.message}`,
        expect.any(String)
      );
    });
  });
});
