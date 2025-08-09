import type { IMuscle } from 'fitness-tracker-contracts';

import { checkInvalidId } from '../common/helpers.js';
import Muscle from './model.js';

export const muscleService = {
  getAll: async () => {
    const muscles = await Muscle.find().sort('title').lean();

    return { data: muscles };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const muscle = await Muscle.findOne({ _id }).lean();

    if (!muscle) throw new Error('Muscle not found', { cause: { code: 404 } });

    return { data: muscle };
  },

  create: async (muscleToCreate: IMuscle) => {
    await Muscle.create(muscleToCreate);
  },

  update: async (_id: string, itemToUpdate: IMuscle) => {
    checkInvalidId(_id);

    await Muscle.findOneAndReplace({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id: string) => {
    checkInvalidId(_id);

    await Muscle.findOneAndDelete({ _id });
  },
};
