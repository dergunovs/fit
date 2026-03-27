import type { IExercise, TDecode } from 'fitness-tracker-contracts';

import { getAuthenticatedUser, allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId, paginate } from '../common/helpers.js';
import { getAdminAndUserExercises, getExercisesByUser } from './helpers.js';
import Exercise from './model.js';
import { EXERCISE_POPULATE } from './constants.js';

export const exerciseService = {
  getMany: async (page: number) => {
    const { data, total } = await paginate(Exercise, page, '-dateCreated', EXERCISE_POPULATE);

    return { data, total };
  },

  getAll: async (decode?: TDecode, token?: string) => {
    const exercises = await getAdminAndUserExercises(decode, token);

    return { data: exercises };
  },

  getCustom: async (decode?: TDecode, token?: string) => {
    const user = getAuthenticatedUser(decode, token);

    const exercises = await getExercisesByUser(user);

    return { data: exercises };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id }).populate(EXERCISE_POPULATE).lean();

    if (!exercise) throw error.notFound();

    return { data: exercise };
  },

  create: async (exerciseToCreate: IExercise, decode?: TDecode, token?: string) => {
    const user = getAuthenticatedUser(decode, token);

    const exercisesCount = user.role === 'admin' ? 1 : await Exercise.countDocuments({ createdBy: user });

    const isAllowToCreateExercise = user.role === 'admin' || exercisesCount < 21;

    if (!isAllowToCreateExercise) throw error.forbidden();

    await Exercise.create({ ...exerciseToCreate, createdBy: user, isCustom: user.role !== 'admin' });
  },

  update: async (_id: string, itemToUpdate: IExercise, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id });

    if (!exercise?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exercise.replaceOne({ ...itemToUpdate, dateUpdated: new Date() });

    await exercise.save();
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await Exercise.findOne({ _id });

    if (!exercise?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exercise.deleteOne();
  },
};
