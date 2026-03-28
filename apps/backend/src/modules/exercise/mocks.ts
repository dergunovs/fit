import { vi } from 'vitest';
import { IExercise } from 'fitness-tracker-contracts';

import { mockEquipment } from '../equipment/mocks.js';
import { IExerciseRepository } from './repository.js';

export const mockExercise: IExercise = {
  _id: 'ex1',
  title: 'Push-ups',
  title_en: 'Push-ups',
  isWeights: false,
  isWeightsRequired: false,
  equipment: mockEquipment,
};

export const mockExercise2: IExercise = {
  _id: 'ex2',
  title: 'Squats',
  title_en: 'Squats',
  isWeights: false,
  isWeightsRequired: false,
  equipment: mockEquipment,
};

export const mockExerciseRepository = {
  getMany: vi.fn(),
  getByUser: vi.fn(),
  getOne: vi.fn(),
  countByUser: vi.fn(),
  create: vi.fn(),
  deleteOne: vi.fn(),
  findExerciseById: vi.fn(),
  replaceOne: vi.fn(),
  findAdminUser: vi.fn(),
} satisfies IExerciseRepository;
