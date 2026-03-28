import { vi } from 'vitest';
import mongoose from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

import { mockEquipment, mockEquipmentForWeight } from '../equipment/mocks.js';
import { createMockRepository } from '../common/test/mockFactories.js';
import { IUserRepository } from './repository.js';

export const userId = new mongoose.Types.ObjectId().toString();
export const adminId = new mongoose.Types.ObjectId().toString();
export const otherUserId = new mongoose.Types.ObjectId().toString();

export const mockUser: IUser = {
  _id: userId,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
  equipments: [{ equipment: mockEquipment }],
};

export const mockAdmin: IUser = {
  _id: adminId,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
};

export const mockUserNoEquipments: IUser = {
  _id: new mongoose.Types.ObjectId().toString(),
  name: 'User No Equipments',
  email: 'noequip@example.com',
  role: 'user' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
};

export const mockUserEmptyEquipments: IUser = {
  _id: new mongoose.Types.ObjectId().toString(),
  name: 'User Empty Equipments',
  email: 'empty@example.com',
  role: 'user' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
  equipments: [],
};

export const mockUserWithEquipmentForWeight: IUser = {
  _id: new mongoose.Types.ObjectId().toString(),
  name: 'User With Equipment For Weight',
  email: 'weight@example.com',
  role: 'user' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
  equipments: [{ equipment: mockEquipment }, { equipment: mockEquipmentForWeight }],
};

export const mockUserWithCustomGoals: IUser = {
  _id: new mongoose.Types.ObjectId().toString(),
  name: 'User With Custom Goals',
  email: 'goals@example.com',
  role: 'user' as const,
  isResetPassword: false,
  dateLoggedIn: new Date(),
  goalActivities: 5,
  goalSets: 30,
  goalRepeats: 15,
  goalDuration: 60,
};

export const mockUserRepository = {
  ...createMockRepository<IUserRepository>([
    'findUserForActivityStats',
    'findUserForChart',
    'getMany',
    'getOne',
    'findByFilter',
    'findByFilterWithEquipments',
    'create',
    'updateOne',
    'deleteOne',
    'updatePassword',
  ]),
} satisfies IUserRepository;

export const mockUserService = {
  getMany: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  updatePassword: vi.fn(),
  feedback: vi.fn(),
  findUserForActivityStats: vi.fn().mockResolvedValue(mockUser),
  findUserForChart: vi.fn().mockResolvedValue(mockUser),
};
