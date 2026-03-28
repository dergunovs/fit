import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  testNotFoundScenario,
  testInvalidIdScenario,
  testAccessDeniedScenario,
  testSuccessScenario,
} from '../common/test/testHelpers.js';
import { mockExerciseRepository } from '../exercise/mocks.js';
import { mockMuscleRepository } from '../muscle/mocks.js';
import { mockUser, mockAdmin, otherUserId, mockUserRepository } from '../user/mocks.js';
import { mockActivityRepository, mockActivity, mockActivityPrev, activityId } from './mocks.js';
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

  describe('getStatistics', () => {
    it('returns statistics for user', async () => {
      const mockActivities = [{ current: [mockActivity], previous: [mockActivityPrev] }];

      mockUserRepository.findUserForActivityStats.mockResolvedValue(mockUser);
      mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
      mockExerciseRepository.getByUser.mockResolvedValue([]);
      mockActivityRepository.getStatistics.mockResolvedValue(mockActivities);

      const result = await service.getStatistics(7, mockUser);

      expect(mockUserRepository.findUserForActivityStats).toHaveBeenCalled();
      expect(mockActivityRepository.getStatistics).toHaveBeenCalled();
      expect(result).toHaveProperty('activity');
      expect(result).toHaveProperty('exercise');
    });

    testNotFoundScenario(service.getStatistics, mockUserRepository.findUserForActivityStats, 7, mockUser);
  });

  describe('getCalendar', () => {
    it('returns calendar data for user', async () => {
      const mockCalendarData = [{ date: '2024-01-15', count: 2 }];

      mockUserRepository.findUserForActivityStats.mockResolvedValue(mockUser);
      mockActivityRepository.getCalendar.mockResolvedValue(mockCalendarData);

      const result = await service.getCalendar('2024-01-01', '2024-01-31', mockUser);

      expect(mockUserRepository.findUserForActivityStats).toHaveBeenCalled();
      expect(mockActivityRepository.getCalendar).toHaveBeenCalled();
      expect(result).toEqual(mockCalendarData);
    });

    testNotFoundScenario(
      service.getCalendar,
      mockUserRepository.findUserForActivityStats,
      '2024-01-01',
      '2024-01-31',
      mockUser
    );
  });

  describe('getChart', () => {
    it('returns chart data for user', async () => {
      mockUserRepository.findUserForChart.mockResolvedValue(mockUser);
      mockMuscleRepository.findAll.mockResolvedValue([]);
      mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);
      mockActivityRepository.getMuscleActivities.mockResolvedValue([]);

      const result = await service.getChart('muscle', 'false', 'false', 'en', mockUser);

      expect(mockUserRepository.findUserForChart).toHaveBeenCalled();
      expect(mockMuscleRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
    });

    testNotFoundScenario(
      service.getChart,
      mockUserRepository.findUserForChart,
      'muscle',
      'false',
      'false',
      'en',
      mockUser
    );
  });

  describe('getOne', () => {
    testSuccessScenario({
      setupMocks: () => {
        mockActivityRepository.getOne.mockResolvedValue(mockActivity);
      },
      serviceMethod: service.getOne,
      repositoryMethod: mockActivityRepository.getOne,
      ownerArgs: [activityId, mockUser],
      adminArgs: [activityId, mockAdmin],
    });

    testNotFoundScenario(service.getOne, mockActivityRepository.getOne, activityId, mockAdmin);

    testAccessDeniedScenario({
      setupMocks: () => {
        const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

        mockActivityRepository.getOne.mockResolvedValue(otherUserActivity);
      },
      serviceMethod: service.getOne,
      mockRepository: mockActivityRepository,
      args: [activityId, mockUser],
    });

    testInvalidIdScenario(service.getOne, 'invalid-id', mockUser);
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
    testSuccessScenario({
      setupMocks: () => {
        mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
        mockActivityRepository.updateOne.mockResolvedValue(undefined);
      },
      serviceMethod: service.update,
      repositoryMethod: mockActivityRepository.updateOne,
      ownerArgs: [activityId, mockActivity, mockUser],
      adminArgs: [activityId, mockActivity, mockAdmin],
    });

    testNotFoundScenario(service.update, mockActivityRepository.findActivityById, activityId, mockActivity, mockUser);

    testAccessDeniedScenario({
      setupMocks: () => {
        const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

        mockActivityRepository.findActivityById.mockResolvedValue(otherUserActivity);
      },
      serviceMethod: service.update,
      mockRepository: mockActivityRepository,
      args: [activityId, mockActivity, mockUser],
    });

    testInvalidIdScenario(service.update, 'invalid-id', mockActivity, mockUser);
  });

  describe('delete', () => {
    testSuccessScenario({
      setupMocks: () => {
        mockActivityRepository.findActivityById.mockResolvedValue(mockActivity);
        mockActivityRepository.deleteOne.mockResolvedValue(undefined);
      },
      serviceMethod: service.delete,
      repositoryMethod: mockActivityRepository.deleteOne,
      ownerArgs: [activityId, mockUser],
      adminArgs: [activityId, mockAdmin],
    });

    testNotFoundScenario(service.delete, mockActivityRepository.findActivityById, activityId, mockUser);

    testAccessDeniedScenario({
      setupMocks: () => {
        const otherUserActivity = { ...mockActivity, createdBy: { _id: otherUserId } };

        mockActivityRepository.findActivityById.mockResolvedValue(otherUserActivity);
      },
      serviceMethod: service.delete,
      mockRepository: mockActivityRepository,
      args: [activityId, mockUser],
    });

    testInvalidIdScenario(service.delete, 'invalid-id', mockUser);
  });
});
