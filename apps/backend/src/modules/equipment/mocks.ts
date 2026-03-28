import { vi } from 'vitest';
import { IEquipment } from 'fitness-tracker-contracts';

import { IEquipmentRepository } from './repository.js';

export const mockEquipment: IEquipment = {
  _id: 'eq1',
  title: 'Mat',
  isWeights: false,
};

export const mockEquipmentRepository = {
  getAll: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
} satisfies IEquipmentRepository;
