import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockUser, mockAdmin } from '../user/mocks.js';
import { getExercisesByUser, getAdminAndUserExercises } from './helpers.js';
import { mockExercise, mockExercise2, mockExerciseRepository } from './mocks.js';

describe('getExercisesByUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty array when user has no _id', async () => {
    const userWithoutId = { ...mockUser, _id: undefined };

    const result = await getExercisesByUser(mockExerciseRepository, userWithoutId);

    expect(result).toEqual([]);
    expect(mockExerciseRepository.getByUser).not.toHaveBeenCalled();
  });

  it('throws bad request error for invalid user._id', async () => {
    const userWithInvalidId = { ...mockUser, _id: 'invalid-id' };

    await expect(getExercisesByUser(mockExerciseRepository, userWithInvalidId)).rejects.toThrow('Bad request');
    expect(mockExerciseRepository.getByUser).not.toHaveBeenCalled();
  });

  it('returns exercises from repository when valid user provided', async () => {
    mockExerciseRepository.getByUser.mockResolvedValue([mockExercise, mockExercise2]);

    const result = await getExercisesByUser(mockExerciseRepository, mockUser);

    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual([mockExercise, mockExercise2]);
  });

  it('returns empty array when repository returns no exercises', async () => {
    mockExerciseRepository.getByUser.mockResolvedValue([]);

    const result = await getExercisesByUser(mockExerciseRepository, mockUser);

    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual([]);
  });
});

describe('getAdminAndUserExercises', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws not found error when no admin user exists', async () => {
    mockExerciseRepository.findAdminUser.mockResolvedValue(null);

    await expect(getAdminAndUserExercises(mockExerciseRepository, mockUser)).rejects.toThrow('Not found');
  });

  it('returns admin exercises when no user provided', async () => {
    mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
    mockExerciseRepository.getByUser.mockResolvedValue([mockExercise]);

    const result = await getAdminAndUserExercises(mockExerciseRepository);

    expect(mockExerciseRepository.findAdminUser).toHaveBeenCalled();
    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockAdmin);
    expect(result).toEqual([mockExercise]);
  });

  it('returns admin exercises when user role is admin', async () => {
    mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
    mockExerciseRepository.getByUser.mockResolvedValue([mockExercise]);

    const result = await getAdminAndUserExercises(mockExerciseRepository, mockAdmin);

    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockAdmin);
    expect(result).toEqual([mockExercise]);
  });

  it('returns combined user and admin exercises when user is regular user', async () => {
    const userExercises = [{ ...mockExercise, _id: 'user-ex1' }];
    const adminExercises = [mockExercise2];

    mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
    mockExerciseRepository.getByUser.mockResolvedValueOnce(adminExercises).mockResolvedValueOnce(userExercises);

    const result = await getAdminAndUserExercises(mockExerciseRepository, mockUser);

    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockAdmin);
    expect(mockExerciseRepository.getByUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual([...userExercises, ...adminExercises]);
  });

  it('returns user exercises first then admin exercises', async () => {
    const userExercises = [{ ...mockExercise, _id: 'user-ex1', title: 'User Exercise' }];
    const adminExercises = [{ ...mockExercise2, _id: 'admin-ex1', title: 'Admin Exercise' }];

    mockExerciseRepository.findAdminUser.mockResolvedValue(mockAdmin);
    mockExerciseRepository.getByUser.mockResolvedValueOnce(adminExercises).mockResolvedValueOnce(userExercises);

    const result = await getAdminAndUserExercises(mockExerciseRepository, mockUser);

    expect(result[0].title).toBe('User Exercise');
    expect(result[1].title).toBe('Admin Exercise');
  });
});
