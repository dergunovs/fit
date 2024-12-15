import type { IExercise, IExerciseService, IToken } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import Exercise from './model.js';

export const exerciseService: IExerciseService = {
  getAll: async () => {
    const data = await Exercise.find().sort('title');

    return data as IExercise[];
  },

  getOne: async <T>(_id: string) => {
    const exercise: IExercise | null = await Exercise.findOne({ _id })
      .populate({ path: 'createdBy', select: ['_id', 'name'] })
      .lean()
      .exec();

    return { data: exercise as T };
  },

  create: async <T>(exerciseToCreate: T, decode?: (token: string) => IToken | null, token?: string) => {
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
