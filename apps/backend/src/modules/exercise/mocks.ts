import { vi } from 'vitest';
import type { IExercise, IExerciseDone } from 'fitness-tracker-contracts';

import { mockEquipment, mockEquipmentForWeight } from '../equipment/mocks.ts';
import { createMockRepository } from '../common/test/mockFactories.ts';
import type { IExerciseRepository } from './repository.ts';

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

export const mockExerciseNoEquipment: IExercise = {
  _id: 'ex3',
  title: 'Running',
  title_en: 'Running',
  isWeights: false,
  isWeightsRequired: false,
};

export const mockExerciseOnlyEquipmentForWeight: IExercise = {
  _id: 'ex4',
  title: 'Dumbbell Press',
  title_en: 'Dumbbell Press',
  isWeights: true,
  isWeightsRequired: false,
  equipmentForWeight: [mockEquipmentForWeight],
};

export const mockExerciseWithBothEquipments: IExercise = {
  _id: 'ex5',
  title: 'Weighted Squats',
  title_en: 'Weighted Squats',
  isWeights: true,
  isWeightsRequired: false,
  equipment: mockEquipment,
  equipmentForWeight: [mockEquipmentForWeight],
};

export const mockExerciseWeightsRequired: IExercise = {
  _id: 'ex6',
  title: 'Deadlift',
  title_en: 'Deadlift',
  isWeights: true,
  isWeightsRequired: true,
  equipment: mockEquipment,
  equipmentForWeight: [mockEquipmentForWeight],
};

export const mockExerciseNoEquipmentId: IExercise = {
  _id: 'ex7',
  title: 'Exercise No Equipment Id',
  title_en: 'Exercise No Equipment Id',
  isWeights: false,
  isWeightsRequired: false,
  equipment: { ...mockEquipment, _id: undefined },
};

export const mockExerciseEmptyEquipmentForWeight: IExercise = {
  _id: 'ex8',
  title: 'Exercise Empty Equipment For Weight',
  title_en: 'Exercise Empty Equipment For Weight',
  isWeights: false,
  isWeightsRequired: false,
  equipmentForWeight: [],
};

export const mockExerciseDone: IExerciseDone = {
  exercise: mockExercise,
  repeats: 10,
  duration: 60,
};

export const mockExerciseDone2: IExerciseDone = {
  exercise: mockExercise2,
  repeats: 15,
  duration: 90,
};

export const mockExerciseDoneWithWeight: IExerciseDone = {
  exercise: mockExerciseOnlyEquipmentForWeight,
  repeats: 12,
  weight: 20,
  duration: 45,
};

export const mockExerciseDoneWithDuration: IExerciseDone = {
  exercise: mockExerciseNoEquipment,
  repeats: 1,
  duration: 300,
};

export const mockExerciseDoneIsDone: IExerciseDone = {
  exercise: mockExercise,
  repeats: 10,
  duration: 60,
  isDone: true,
};

export const mockExerciseDoneToFailure: IExerciseDone = {
  exercise: mockExerciseWeightsRequired,
  repeats: 8,
  weight: 50,
  isToFailure: true,
  duration: 40,
};

export const mockExerciseRepository = {
  ...createMockRepository<IExerciseRepository>([
    'getMany',
    'getByUser',
    'getOne',
    'countByUser',
    'create',
    'deleteOne',
    'findExerciseById',
    'replaceOne',
    'findAdminUser',
  ]),
} satisfies IExerciseRepository;

export const mockExerciseService = {
  getMany: vi.fn().mockResolvedValue({ data: [], total: 0 }),
  getAll: vi.fn().mockResolvedValue({ data: [] }),
  getCustom: vi.fn().mockResolvedValue({ data: [] }),
  getOne: vi.fn().mockResolvedValue({ data: null }),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
