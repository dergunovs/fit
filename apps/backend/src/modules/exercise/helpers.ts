import type { IUser } from 'fitness-tracker-contracts';

import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { exerciseRepository } from './repository.js';

export async function getExercisesByUser(user: IUser) {
  if (!user._id) return [];

  checkInvalidId(user._id);

  const exercises = await exerciseRepository.getByUser(user);

  return exercises;
}

export async function getAdminAndUserExercises(user?: IUser) {
  const admin = await exerciseRepository.findAdminUser();

  if (!admin) throw error.notFound();

  if (!user || user.role === 'admin') {
    return getExercisesByUser(admin);
  }

  const [adminExercises, userExercises] = await Promise.all([getExercisesByUser(admin), getExercisesByUser(user)]);

  return [...userExercises, ...adminExercises];
}
