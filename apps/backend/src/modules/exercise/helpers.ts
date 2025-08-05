import type { IExercise, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { checkInvalidId } from '../common/helpers.js';
import User from '../user/model.js';
import Exercise from './model.js';
import { EXERCISE_POPULATE } from './constants.js';

export async function getExercisesByUserId(userId: string) {
  checkInvalidId(userId);

  const exercises = await Exercise.find({ createdBy: userId }).sort('title').populate(EXERCISE_POPULATE).lean();

  return exercises;
}

export async function getAdminAndUserExercises(decode?: TDecode, token?: string) {
  const admin = await User.findOne({ role: 'admin' }).lean();

  if (!admin) return [];

  const adminExercises = await getExercisesByUserId(admin._id);

  const user = decodeToken(decode, token);

  if (!user?._id || user.role === 'admin') return adminExercises as IExercise[];

  const userExercises = await getExercisesByUserId(user._id);

  return [...userExercises, ...adminExercises] as IExercise[];
}
