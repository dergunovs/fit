import type { IExerciseService, TDecode } from 'fitness-tracker-contracts';

import { allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';

import { checkInvalidId, paginate } from '../common/helpers.js';
import { getAdminAndUserExercises, getExercisesByUserId } from './helpers.js';
import Exercise from './model.js';
import { EXERCISE_POPULATE } from './constants.js';

export const exerciseService: IExerciseService = {
  getMany: async <T>(page: number) => {
    const { data, total } = await paginate(Exercise, page, '-dateCreated', EXERCISE_POPULATE);

    return { data: data as T[], total };
  },

  getAll: async (decode?: TDecode, token?: string) => {
    const exercises = await getAdminAndUserExercises(decode, token);

    return { data: exercises };
  },

  getCustom: async (decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    if (!user?._id) return { data: [] };

    const exercises = await getExercisesByUserId(user._id);

    return { data: exercises };
  },

  getOne: async <T>(_id: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id }).populate(EXERCISE_POPULATE).lean();

    return { data: exercise as T };
  },

  create: async <T>(exerciseToCreate: T, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    if (!user?._id) throw new Error('Auth error', { cause: { code: 403 } });

    const exercisesCount = user.role === 'admin' ? 1 : await Exercise.countDocuments({ createdBy: user._id });

    const isAllowToCreateExercise = user.role === 'admin' || exercisesCount < 21;

    if (!isAllowToCreateExercise) throw new Error('Not allowed to add exercise', { cause: { code: 500 } });

    await Exercise.create({ ...exerciseToCreate, createdBy: user._id, isCustom: user.role !== 'admin' });
  },

  update: async <T>(_id: string, itemToUpdate: T, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id });

    if (!exercise?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exercise.replaceOne({ ...itemToUpdate, dateUpdated: new Date() });

    await exercise.save();
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id });

    if (!exercise?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exercise.deleteOne();
  },
};
