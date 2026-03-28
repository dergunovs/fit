import { IMuscle } from 'fitness-tracker-contracts';

import { createMockRepository } from '../common/test/mockFactories.js';
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
  ...createMockRepository<IMuscleRepository>(['findAll', 'getAll', 'getOne', 'create', 'updateOne', 'deleteOne']),
} satisfies IMuscleRepository;
