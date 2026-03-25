import type { IUser, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { checkInvalidId } from '../common/helpers.js';
import User from '../user/model.js';
import Exercise from './model.js';
import { EXERCISE_POPULATE } from './constants.js';

export async function getExercisesByUser(user: IUser) {
  if (!user._id) return [];

  checkInvalidId(user._id);

  const exercises = await Exercise.find({ createdBy: user }).sort('title').populate(EXERCISE_POPULATE).lean();

  return exercises;
}

export async function getAdminAndUserExercises(decode?: TDecode, token?: string) {
  const [admin, user] = await Promise.all([
    User.findOne({ role: 'admin' }).lean(),
    Promise.resolve(decodeToken(decode, token)),
  ]);

  if (!admin) throw new Error('Administrator not found', { cause: { code: 404 } });

  if (!user?._id || user.role === 'admin') {
    return getExercisesByUser(admin);
  }

  const [adminExercises, userExercises] = await Promise.all([getExercisesByUser(admin), getExercisesByUser(user)]);

  return [...userExercises, ...adminExercises];
}
