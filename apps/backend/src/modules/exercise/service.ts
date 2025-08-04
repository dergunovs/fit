import type { IExercise, IExerciseService, TDecode } from 'fitness-tracker-contracts';

import { allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';

import { checkInvalidId, paginate } from '../common/helpers.js';
import { getAdminAndUserExercises } from './helpers.js';
import Exercise from './model.js';

export const exerciseService: IExerciseService = {
  getMany: async <T>(page: number) => {
    const { data, total } = await paginate(Exercise, page, '-dateCreated', [
      { path: 'createdBy', select: ['_id', 'name', 'email'] },
      { path: 'equipment' },
      { path: 'equipmentForWeight' },
      { path: 'muscles' },
    ]);

    return { data: data as T[], total };
  },

  getAll: async (decode?: TDecode, token?: string) => {
    const exercises = await getAdminAndUserExercises(decode, token);

    return { data: exercises };
  },

  getCustom: async (decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const exercises = await Exercise.find({ createdBy: user?._id })
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

    return { data: exercises as IExercise[] };
  },

  getOne: async <T>(_id: string) => {
    checkInvalidId(_id);

    const exercise: IExercise | null = await Exercise.findOne({ _id })
      .populate([
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
        { path: 'equipment' },
        { path: 'equipmentForWeight' },
        { path: 'muscles' },
      ])
      .lean()
      .exec();

    return { data: exercise as T };
  },

  create: async <T>(exerciseToCreate: T, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const userExercisesCount = await Exercise.countDocuments({ createdBy: user?._id });

    const isAllowToCreateExercise = user?.role === 'admin' || userExercisesCount < 21;

    if (isAllowToCreateExercise) {
      const exercise = new Exercise({ ...exerciseToCreate, createdBy: user?._id, isCustom: user?.role !== 'admin' });

      await exercise.save();

      return true;
    } else {
      return false;
    }
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
