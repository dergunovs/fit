import { vi } from 'vitest';
import { IMuscle } from 'fitness-tracker-contracts';

import { IMuscleRepository } from './repository.js';

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
  findAll: vi.fn(),
  getAll: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
} satisfies IMuscleRepository;
