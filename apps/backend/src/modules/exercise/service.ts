import type { IExercise, IExerciseService, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import Exercise from './model.js';

export const exerciseService: IExerciseService = {
  getAll: async () => {
    const exercises = await Exercise.find()
      .sort('title')
      .populate([
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
        { path: 'equipment' },
        { path: 'equipmentForWeight' },
      ])
      .lean()
      .exec();

    return { data: exercises as IExercise[] };
  },

  getOne: async <T>(_id: string) => {
    const exercise: IExercise | null = await Exercise.findOne({ _id })
      .populate([
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
        { path: 'equipment' },
        { path: 'equipmentForWeight' },
      ])
      .lean()
      .exec();

    return { data: exercise as T };
  },

  create: async <T>(exerciseToCreate: T, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const exercise = new Exercise({ ...exerciseToCreate, createdBy: user?._id });

    await exercise.save();
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    await Exercise.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id?: string) => {
    const exercise = await Exercise.findOne({ _id });

    await exercise?.deleteOne();
  },
};
