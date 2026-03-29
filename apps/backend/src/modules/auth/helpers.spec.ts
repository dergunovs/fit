import { describe, it, expect, vi } from 'vitest';
import type { FastifyRequest } from 'fastify';

import { mockUser, mockAdmin } from '../user/mocks.ts';
import {
  decodeToken,
  filterUserData,
  allowAccessToAdminAndCurrentUser,
  adminOrUserFilter,
  requireUser,
} from './helpers.ts';

describe('decodeToken', () => {
  it('decodes valid token', () => {
    const mockDecode = vi.fn().mockReturnValue(mockUser);
    const result = decodeToken(mockDecode, 'Bearer valid-token');

    expect(mockDecode).toHaveBeenCalledWith('valid-token');
    expect(result).toEqual(mockUser);
  });

  it('returns null when no token provided', () => {
    const mockDecode = vi.fn();
    const result = decodeToken(mockDecode);

    expect(result).toBeNull();
  });

  it('returns null when no decode function provided', () => {
    const result = decodeToken(undefined, 'Bearer valid-token');

    expect(result).toBeNull();
  });

  it('returns null when token format is invalid', () => {
    const mockDecode = vi.fn();
    const result = decodeToken(mockDecode, 'InvalidFormat token');

    expect(result).toBeNull();
  });

  it('returns null when decode returns null', () => {
    const mockDecode = vi.fn().mockReturnValue(null);
    const result = decodeToken(mockDecode, 'Bearer valid-token');

    expect(mockDecode).toHaveBeenCalledWith('valid-token');
    expect(result).toBeNull();
  });
});

describe('filterUserData', () => {
  it('filters user data for token', () => {
    const userWithExtra = {
      ...mockUser,
      equipments: [{ equipment: { _id: 'eq1', title: 'Mat', isWeights: false } }],
      templates: [{ title: 'Template 1', exercises: [] }],
      defaultWeights: { ex1: 10 },
    };

    const result = filterUserData(userWithExtra, true);

    expect(result.equipments).toBeUndefined();
    expect(result.templates).toBeUndefined();
    expect(result.defaultWeights).toEqual({});
    expect(result._id).toBe(mockUser._id);
    expect(result.name).toBe(mockUser.name);
  });

  it('filters user data without token', () => {
    const userWithExtra = {
      ...mockUser,
      equipments: [{ equipment: { _id: 'eq1', title: 'Mat', isWeights: false } }],
      templates: [{ title: 'Template 1', exercises: [] }],
      defaultWeights: { ex1: 10 },
    };

    const result = filterUserData(userWithExtra, false);

    expect(result.equipments).toEqual(userWithExtra.equipments);
    expect(result.templates).toEqual(userWithExtra.templates);
    expect(result.defaultWeights).toEqual(userWithExtra.defaultWeights);
  });
});

describe('allowAccessToAdminAndCurrentUser', () => {
  it('allows admin access', () => {
    expect(() => allowAccessToAdminAndCurrentUser('any-user-id', mockAdmin)).not.toThrow();
  });

  it('allows current user access', () => {
    expect(() => allowAccessToAdminAndCurrentUser(mockUser._id as string, mockUser)).not.toThrow();
  });

  it('throws forbidden error for other users', () => {
    expect(() => allowAccessToAdminAndCurrentUser('other-user-id', mockUser)).toThrow('Access denied');
  });
});

describe('adminOrUserFilter', () => {
  it('returns user filter when user provided', () => {
    const result = adminOrUserFilter(mockUser);

    expect(result).toEqual({ email: mockUser.email });
  });

  it('returns admin filter when no user provided', () => {
    const result = adminOrUserFilter(undefined);

    expect(result).toEqual({ role: 'admin' });
  });
});

describe('requireUser', () => {
  it('returns user from request', () => {
    const mockRequest = { currentUser: mockUser } as unknown as FastifyRequest;

    const result = requireUser(mockRequest);

    expect(result).toEqual(mockUser);
  });

  it('throws unauthorized when no user in request', () => {
    const mockRequest = { currentUser: undefined } as unknown as FastifyRequest;

    expect(() => requireUser(mockRequest)).toThrow('Unauthorized');
  });
});
