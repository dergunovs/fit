import mongoose from 'mongoose';
import { vi } from 'vitest';
import { IActivity } from 'fitness-tracker-contracts';

import { mockUser } from '../user/mocks.js';
import { mockExercise, mockExercise2 } from '../exercise/mocks.js';
import { IActivityRepository } from './repository.js';

export const activityId = new mongoose.Types.ObjectId().toString();

export const mockActivity: IActivity = {
  _id: '1',
  exercises: [
    { exercise: mockExercise, repeats: 10, duration: 60 },
    { exercise: mockExercise2, repeats: 15, duration: 90 },
  ],
  dateCreated: new Date('2024-01-15T10:00:00Z'),
  dateUpdated: new Date('2024-01-15T11:00:00Z'),
  isDone: true,
  createdBy: mockUser,
};

export const mockActivityPrev: IActivity = {
  _id: '2',
  exercises: [{ exercise: mockExercise, repeats: 8, duration: 50 }],
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
  getMany: vi.fn(),
  getOne: vi.fn(),
  getStatistics: vi.fn(),
  getCalendar: vi.fn(),
  getChartActivities: vi.fn(),
  getMuscleActivities: vi.fn(),
  create: vi.fn(),
  findActivityById: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
} satisfies IActivityRepository;
