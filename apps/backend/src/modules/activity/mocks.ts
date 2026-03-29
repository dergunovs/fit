import { vi } from 'vitest';
import mongoose from 'mongoose';
import type { IActivity } from 'fitness-tracker-contracts';

import { mockUser } from '../user/mocks.ts';
import { mockExerciseDone, mockExerciseDone2 } from '../exercise/mocks.ts';
import { createMockRepository } from '../common/test/mockFactories.ts';
import type { IActivityRepository } from './repository.ts';

export const activityId = new mongoose.Types.ObjectId().toString();

export const mockActivity: IActivity = {
  _id: '1',
  exercises: [mockExerciseDone, mockExerciseDone2],
  dateCreated: new Date('2024-01-15T10:00:00Z'),
  dateUpdated: new Date('2024-01-15T11:00:00Z'),
  isDone: true,
  createdBy: mockUser,
};

export const mockActivityPrev: IActivity = {
  _id: '2',
  exercises: [mockExerciseDone],
  dateCreated: new Date('2024-01-08'),
  dateUpdated: new Date('2024-01-08'),
  isDone: true,
  createdBy: mockUser,
};

export const mockWeeks = [
  {
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-01-08'),
    label: 'Week 1',
  },
  {
    dateFrom: new Date('2024-01-08'),
    dateTo: new Date('2024-01-15'),
    label: 'Week 2',
  },
];

export const mockActivityRepository = {
  ...createMockRepository<IActivityRepository>([
    'getMany',
    'getOne',
    'getStatistics',
    'getCalendar',
    'getChartActivities',
    'getMuscleActivities',
    'create',
    'findActivityById',
    'updateOne',
    'deleteOne',
  ]),
} satisfies IActivityRepository;

export const mockActivityService = {
  getMany: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  getOne: vi.fn().mockResolvedValue({ data: null }),
  getStatistics: vi.fn().mockResolvedValue({
    activity: {
      activitiesCount: { cur: 0, dynamics: 0 },
      setsCount: { cur: 0, dynamics: 0 },
      repeatsCount: { cur: 0, dynamics: 0 },
      duration: { cur: 0, dynamics: 0 },
      averageSetsPerActivity: { cur: 0, dynamics: 0 },
      averageRepeatsPerSet: { cur: 0, dynamics: 0 },
      averageDuration: { cur: 0, dynamics: 0 },
      averageRestPercent: { cur: 0, dynamics: 0 },
    },
    exercise: [],
  }),
  getCalendar: vi.fn().mockResolvedValue([]),
  getChart: vi.fn().mockResolvedValue({ labels: [], datasets: [] }),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
