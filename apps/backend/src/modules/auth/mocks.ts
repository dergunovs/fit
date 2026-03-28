import { vi } from 'vitest';

import { IAuthRepository } from './repository.js';

export const mockAuthRepository = {
  findByEmail: vi.fn(),
  findByEmailWithPassword: vi.fn(),
  countUsers: vi.fn(),
  countByEmail: vi.fn(),
  createUser: vi.fn(),
  updateByEmail: vi.fn(),
  updateById: vi.fn(),
  saveUser: vi.fn(),
} satisfies IAuthRepository;
