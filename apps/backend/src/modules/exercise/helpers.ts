import type { IUser } from 'fitness-tracker-contracts';

import { error } from '../common/errorHandler.ts';
import { checkInvalidId } from '../common/helpers.ts';
import type { IExerciseRepository } from './repository.ts';

export async function getExercisesByUser(exerciseRepository: IExerciseRepository, user: IUser) {
  if (!user._id) return [];

  checkInvalidId(user._id);

  const exercises = await exerciseRepository.getByUser(user);

  return exercises;
}

export async function getAdminAndUserExercises(exerciseRepository: IExerciseRepository, user?: IUser) {
  const admin = await exerciseRepository.findAdminUser();

  if (!admin) throw error.notFound();

  if (!user || user.role === 'admin') {
    return getExercisesByUser(exerciseRepository, admin);
  }

  const [adminExercises, userExercises] = await Promise.all([
    getExercisesByUser(exerciseRepository, admin),
    getExercisesByUser(exerciseRepository, user),
  ]);

  return [...userExercises, ...adminExercises];
}
