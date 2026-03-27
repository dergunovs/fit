import type { IUser, TDecode } from 'fitness-tracker-contracts';

import { getAuthenticatedUser } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { exerciseRepository } from './repository.js';

export async function getExercisesByUser(user: IUser) {
  if (!user._id) return [];

  checkInvalidId(user._id);

  const exercises = await exerciseRepository.getByUser(user);

  return exercises;
}

export async function getAdminAndUserExercises(decode?: TDecode, token?: string) {
  const [admin, user] = await Promise.all([
    exerciseRepository.findAdminUser(),
    Promise.resolve(getAuthenticatedUser(decode, token)),
  ]);

  if (!admin) throw error.notFound();

  if (user.role === 'admin') {
    return getExercisesByUser(admin);
  }

  const [adminExercises, userExercises] = await Promise.all([getExercisesByUser(admin), getExercisesByUser(user)]);

  return [...userExercises, ...adminExercises];
}
