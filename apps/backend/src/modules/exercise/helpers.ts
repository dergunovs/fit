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
  const admin = await User.findOne({ role: 'admin' }).lean();

  if (!admin) throw new Error('Administrator not found', { cause: { code: 404 } });

  const adminExercises = await getExercisesByUser(admin);

  const user = decodeToken(decode, token);

  if (!user?._id || user.role === 'admin') return adminExercises;

  const userExercises = await getExercisesByUser(user);

  return [...userExercises, ...adminExercises];
}
