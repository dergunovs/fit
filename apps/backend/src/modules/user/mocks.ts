import mongoose from 'mongoose';
import { vi } from 'vitest';
import { IUser } from 'fitness-tracker-contracts';

import { mockEquipment } from '../equipment/mocks.js';
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

export const mockUserRepository = {
  findUserForActivityStats: vi.fn(),
  findUserForChart: vi.fn(),
  getMany: vi.fn(),
  getOne: vi.fn(),
  findByFilter: vi.fn(),
  findByFilterWithEquipments: vi.fn(),
  create: vi.fn(),
  updateOne: vi.fn(),
  deleteOne: vi.fn(),
  updatePassword: vi.fn(),
} satisfies IUserRepository;
