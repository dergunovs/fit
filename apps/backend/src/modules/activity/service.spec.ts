import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockExerciseRepository } from '../exercise/mocks.js';
import { mockMuscleRepository } from '../muscle/mocks.js';
import { mockUser, mockAdmin, otherUserId, mockUserRepository } from '../user/mocks.js';
import { mockActivityRepository, mockActivity, activityId } from './mocks.js';
import { createActivityService } from './service.js';

const service = createActivityService({
  activityRepository: mockActivityRepository,
  userRepository: mockUserRepository,
  muscleRepository: mockMuscleRepository,
  exerciseRepository: mockExerciseRepository,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createActivityService', () => {
  describe('getMany', () => {
    it('returns activities with pagination', async () => {
      const mockData = { data: [mockActivity], total: 1 };

      mockActivityRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany(1);

      expect(mockActivityRepository.getMany).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });

    it('handles undefined page parameter', async () => {
      const mockData = { data: [mockActivity], total: 1 };

      mockActivityRepository.getMany.mockResolvedValue(mockData);

      const result = await service.getMany();

      expect(mockActivityRepository.getMany).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('getOne', () => {
    it('returns activity for admin user', async () => {
      mockActivityRepository.getOne.mockResolvedValue(mockActivity);

      const result = await service.getOne(activityId, mockAdmin);

      expect(mockActivityRepository.getOne).toHaveBeenCalledWith(activityId);
      expect(result).toEqual({ data: mockActivity });
    });

    it('returns activity for owner user', async () => {
      mockActivityRepository.getOne.mockResolvedValue(mockActivity);

      const result = await service.getOne(activityId, mockUser);

      expect(result).toEqual({ data: mockActivity });
    });

    it('throws not found when activity does not exist', async () => {
      mockActivityRepository.getOne.mockResolvedValue(null);

      await expect(service.getOne(activityId, mockAdmin)).rejects.toThrow('Not found');
    });

    it('throws forbidden for non-owner non-admin user', async () => {
      const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

      mockActivityRepository.getOne.mockResolvedValue(otherUserActivity);

      await expect(service.getOne(activityId, mockUser)).rejects.toThrow('Access denied');
    });

    it('throws bad request for invalid id', async () => {
      await expect(service.getOne('invalid-id', mockUser)).rejects.toThrow('Bad request');
    });
  });

  describe('create', () => {
    it('creates activity successfully', async () => {
      const newActivityId = 'new-activity-id';

      mockActivityRepository.create.mockResolvedValue(newActivityId);

      const result = await service.create(mockActivity, mockUser);

      expect(mockActivityRepository.create).toHaveBeenCalledWith({
        ...mockActivity,
        createdBy: mockUser,
      });
      expect(result).toBe(newActivityId);
    });

    it('throws internal error when creation fails', async () => {
      mockActivityRepository.create.mockResolvedValue(null);

      await expect(service.create(mockActivity, mockUser)).rejects.toThrow('Internal server error');
    });
  });

  describe('update', () => {
    it('updates activity successfully for owner', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
      mockActivityRepository.updateOne.mockResolvedValue(undefined);

      await service.update(activityId, mockActivity, mockUser);

      expect(mockActivityRepository.findActivityById).toHaveBeenCalledWith(activityId);
      expect(mockActivityRepository.updateOne).toHaveBeenCalled();
    });

    it('updates activity successfully for admin', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
      mockActivityRepository.updateOne.mockResolvedValue(undefined);

      await service.update(activityId, mockActivity, mockAdmin);

      expect(mockActivityRepository.updateOne).toHaveBeenCalled();
    });

    it('throws not found when activity does not exist', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(null);

      await expect(service.update(activityId, mockActivity, mockUser)).rejects.toThrow('Not found');
    });

    it('throws forbidden for non-owner non-admin user', async () => {
      const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

      mockActivityRepository.findActivityById.mockResolvedValue(otherUserActivity);

      await expect(service.update(activityId, mockActivity, mockUser)).rejects.toThrow('Access denied');
    });

    it('throws bad request for invalid id', async () => {
      await expect(service.update('invalid-id', mockActivity, mockUser)).rejects.toThrow('Bad request');
    });
  });

  describe('delete', () => {
    it('deletes activity successfully for owner', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
      mockActivityRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete(activityId, mockUser);

      expect(mockActivityRepository.findActivityById).toHaveBeenCalledWith(activityId);
      expect(mockActivityRepository.deleteOne).toHaveBeenCalled();
    });

    it('deletes activity successfully for admin', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
      mockActivityRepository.deleteOne.mockResolvedValue(undefined);

      await service.delete(activityId, mockAdmin);

      expect(mockActivityRepository.deleteOne).toHaveBeenCalled();
    });

    it('throws not found when activity does not exist', async () => {
      mockActivityRepository.findActivityById.mockResolvedValue(null);

      await expect(service.delete(activityId, mockUser)).rejects.toThrow('Not found');
    });

    it('throws forbidden for non-owner non-admin user', async () => {
      const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

      mockActivityRepository.findActivityById.mockResolvedValue(otherUserActivity);

      await expect(service.delete(activityId, mockUser)).rejects.toThrow('Access denied');
    });

    it('throws bad request for invalid id', async () => {
      await expect(service.delete('invalid-id', mockUser)).rejects.toThrow('Bad request');
    });
  });
});
