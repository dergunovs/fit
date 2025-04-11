import type { IExercise, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import User from '../user/model.js';
import Exercise from './model.js';

export async function getAdminAndUserExercises(decode?: TDecode, token?: string) {
  const admin = await User.findOne({ role: 'admin' }).lean().exec();

  const adminExercises = await Exercise.find({ createdBy: admin?._id })
    .select(
      '_id title title_en description description_en equipment equipmentForWeight isWeights isWeightsRequired muscles isCustom'
    )
    .sort('title')
    .populate([
      { path: 'createdBy', select: ['_id', 'name', 'email'] },
      { path: 'equipment' },
      { path: 'equipmentForWeight' },
      { path: 'muscles' },
    ])
    .lean()
    .exec();

  const user = decodeToken(decode, token);

  if (!user || user?.role === 'admin') return adminExercises as IExercise[];

  const userExercises = await Exercise.find({ createdBy: user._id })
    .select(
      '_id title title_en description description_en equipment equipmentForWeight isWeights isWeightsRequired muscles isCustom'
    )
    .sort('title')
    .populate([
      { path: 'createdBy', select: ['_id', 'name', 'email'] },
      { path: 'equipment' },
      { path: 'equipmentForWeight' },
      { path: 'muscles' },
    ])
    .lean()
    .exec();

  return [...userExercises, ...adminExercises] as IExercise[];
}
