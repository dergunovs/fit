import { vi } from 'vitest';
import type { IMuscle } from 'fitness-tracker-contracts';

import { createMockRepository } from '../common/test/mockFactories.ts';
import type { IMuscleRepository } from './repository.ts';

export const mockMuscle: IMuscle = {
  _id: 'muscle1',
  title: 'Грудные мышцы',
  title_en: 'Chest',
  color: '#ff6b6b',
  dateCreated: new Date('2024-01-01'),
  dateUpdated: new Date('2024-01-01'),
};

export const mockMuscle2: IMuscle = {
  _id: 'muscle2',
  title: 'Бицепс',
  title_en: 'Biceps',
  color: '#4ecdc4',
  dateCreated: new Date('2024-01-01'),
  dateUpdated: new Date('2024-01-01'),
};

export const mockMuscleRepository = {
  ...createMockRepository<IMuscleRepository>(['findAll', 'getAll', 'getOne', 'create', 'updateOne', 'deleteOne']),
} satisfies IMuscleRepository;

export const mockMuscleService = {
  getAll: vi.fn().mockResolvedValue({ data: [] }),
  getOne: vi.fn().mockResolvedValue({ data: null }),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
