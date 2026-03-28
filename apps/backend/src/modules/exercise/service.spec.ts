import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  testNotFoundScenario,
  testInvalidIdScenario,
  testAccessDeniedScenario,
  testSuccessScenario,
} from '../common/test/testHelpers.js';
import { mockUser, mockAdmin, otherUserId } from '../user/mocks.js';
import { mockExercise, mockExercise2, mockExerciseRepository } from './mocks.js';
import { MAX_CUSTOM_EXERCISES } from './constants.js';
import { createExerciseService } from './service.js';

const service = createExerciseService({ exerciseRepository: mockExerciseRepository });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createExerciseService', () => {
  describe('getMany', () => {
    it('returns exercises with pagination', async () => {
      const mockData = { data: [mockExercise, mockExercise2], total: 2 };

      mockExerciseRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany(1);

      expect(mockExerciseRepository.getMany).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });

    it('handles page parameter', async () => {
      const mockData = { data: [mockExercise], total: 10 };

      mockExerciseRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany(3);

      expect(mockExerciseRepository.getMany).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAll', () => {
    it('returns admin exercises when user is admin', async () => {
      const adminExercises = [mockExercise, mockExercise2];

      mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
      mockExerciseRepository.getByUser.mockResolvedValue(adminExercises);

      const result = await service.getAll(mockAdmin);

      expect(mockExerciseRepository.findAdminUser).toHaveBeenCalled();
      expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual({ data: adminExercises });
    });

    it('returns combined user and admin exercises when user is regular user', async () => {
      const userExercises = [{ ...mockExercise, _id: 'user-ex1' }];
      const adminExercises = [mockExercise2];

      mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
      mockExerciseRepository.getByUser.mockResolvedValueOnce(adminExercises).mockResolvedValueOnce(userExercises);

      const result = await service.getAll(mockUser);

      expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockAdmin);
      expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ data: [...userExercises, ...adminExercises] });
    });

    testNotFoundScenario(service.getAll, mockExerciseRepository.findAdminUser, mockUser);
  });

  describe('getCustom', () => {
    it('returns user custom exercises', async () => {
      const userExercises = [mockExercise, mockExercise2];

      mockExerciseRepository.getByUser.mockResolvedValue(userExercises);

      const result = await service.getCustom(mockUser);

      expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ data: userExercises });
    });

    it('returns empty array when user has no custom exercises', async () => {
      mockExerciseRepository.getByUser.mockResolvedValue([]);

      const result = await service.getCustom(mockUser);

      expect(result).toEqual({ data: [] });
    });
  });

  describe('getOne', () => {
    it('returns exercise when found', async () => {
      mockExerciseRepository.getOne.mockResolvedValue(mockExercise);

      const result = await service.getOne('507f1f77bcf86cd799439011');

      expect(mockExerciseRepository.getOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({ data: mockExercise });
    });

    testNotFoundScenario(service.getOne, mockExerciseRepository.getOne, '507f1f77bcf86cd799439011');

    testInvalidIdScenario(service.getOne, 'invalid-id');
  });

  describe('create', () => {
    it('creates exercise successfully for admin user', async () => {
      mockExerciseRepository.create.mockResolvedValue(undefined);

      await service.create(mockExercise, mockAdmin);

      expect(mockExerciseRepository.create).toHaveBeenCalledWith({
        ...mockExercise,
        createdBy: mockAdmin,
        isCustom: false,
      });
    });

    it('creates exercise successfully for regular user under limit', async () => {
      mockExerciseRepository.countByUser.mockResolvedValue(MAX_CUSTOM_EXERCISES - 1);
      mockExerciseRepository.create.mockResolvedValue(undefined);

      await service.create(mockExercise, mockUser);

      expect(mockExerciseRepository.countByUser).toHaveBeenCalledWith(mockUser);
      expect(mockExerciseRepository.create).toHaveBeenCalledWith({
        ...mockExercise,
        createdBy: mockUser,
        isCustom: true,
      });
    });

    it('throws forbidden when regular user exceeds MAX_CUSTOM_EXERCISES', async () => {
      mockExerciseRepository.countByUser.mockResolvedValue(MAX_CUSTOM_EXERCISES);

      await expect(service.create(mockExercise, mockUser)).rejects.toThrow('Access denied');
    });

    it('allows admin to create regardless of count', async () => {
      mockExerciseRepository.create.mockResolvedValue(undefined);

      await service.create(mockExercise, mockAdmin);

      expect(mockExerciseRepository.countByUser).not.toHaveBeenCalled();
      expect(mockExerciseRepository.create).toHaveBeenCalled();
    });

    it('sets isCustom to false for admin exercises', async () => {
      mockExerciseRepository.create.mockResolvedValue(undefined);

      await service.create(mockExercise, mockAdmin);

      expect(mockExerciseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ isCustom: false }));
    });

    it('sets isCustom to true for user exercises', async () => {
      mockExerciseRepository.countByUser.mockResolvedValue(0);
      mockExerciseRepository.create.mockResolvedValue(undefined);

      await service.create(mockExercise, mockUser);

      expect(mockExerciseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ isCustom: true }));
    });
  });

  describe('update', () => {
    const userExercise = { ...mockExercise, createdBy: { _id: mockUser._id } };

    testSuccessScenario({
      setupMocks: () => {
        mockExerciseRepository.findExerciseById.mockResolvedValue(userExercise);
        mockExerciseRepository.replaceOne.mockResolvedValue(undefined);
      },
      serviceMethod: service.update,
      repositoryMethod: mockExerciseRepository.replaceOne,
      ownerArgs: ['507f1f77bcf86cd799439011', mockExercise, mockUser],
      adminArgs: ['507f1f77bcf86cd799439011', mockExercise, mockAdmin],
    });

    testNotFoundScenario(
      service.update,
      mockExerciseRepository.findExerciseById,
      '507f1f77bcf86cd799439011',
      mockExercise,
      mockUser
    );

    it('throws not found when exercise has no createdBy', async () => {
      const exerciseWithoutCreator = { ...mockExercise, createdBy: undefined };

      mockExerciseRepository.findExerciseById.mockResolvedValue(exerciseWithoutCreator);

      await expect(service.update('507f1f77bcf86cd799439011', mockExercise, mockUser)).rejects.toThrow('Not found');
    });

    testAccessDeniedScenario({
      setupMocks: () => {
        const otherUserExercise = { ...mockExercise, createdBy: { _id: otherUserId } };

        mockExerciseRepository.findExerciseById.mockResolvedValue(otherUserExercise);
      },
      serviceMethod: service.update,
      mockRepository: mockExerciseRepository,
      args: ['507f1f77bcf86cd799439011', mockExercise, mockUser],
    });

    testInvalidIdScenario(service.update, 'invalid-id', mockExercise, mockUser);
  });

  describe('delete', () => {
    const userExercise = { ...mockExercise, createdBy: { _id: mockUser._id } };

    testSuccessScenario({
      setupMocks: () => {
        mockExerciseRepository.findExerciseById.mockResolvedValue(userExercise);
        mockExerciseRepository.deleteOne.mockResolvedValue(undefined);
      },
      serviceMethod: service.delete,
      repositoryMethod: mockExerciseRepository.deleteOne,
      ownerArgs: ['507f1f77bcf86cd799439011', mockUser],
      adminArgs: ['507f1f77bcf86cd799439011', mockAdmin],
    });

    testNotFoundScenario(service.delete, mockExerciseRepository.findExerciseById, '507f1f77bcf86cd799439011', mockUser);

    it('throws not found when exercise has no createdBy', async () => {
      const exerciseWithoutCreator = { ...mockExercise, createdBy: undefined };

      mockExerciseRepository.findExerciseById.mockResolvedValue(exerciseWithoutCreator);

      await expect(service.delete('507f1f77bcf86cd799439011', mockUser)).rejects.toThrow('Not found');
    });

    testAccessDeniedScenario({
      setupMocks: () => {
        const otherUserExercise = { ...mockExercise, createdBy: { _id: otherUserId } };

        mockExerciseRepository.findExerciseById.mockResolvedValue(otherUserExercise);
      },
      serviceMethod: service.delete,
      mockRepository: mockExerciseRepository,
      args: ['507f1f77bcf86cd799439011', mockUser],
    });

    testInvalidIdScenario(service.delete, 'invalid-id', mockUser);
  });
});
