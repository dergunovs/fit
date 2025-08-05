import type { IMuscle, IMuscleService } from 'fitness-tracker-contracts';

import { checkInvalidId } from '../common/helpers.js';
import Muscle from './model.js';

export const muscleService: IMuscleService = {
  getAll: async () => {
    const muscles = await Muscle.find().sort('title').lean();

    return { data: muscles as IMuscle[] };
  },

  getOne: async <T>(_id: string) => {
    checkInvalidId(_id);

    const muscle: IMuscle | null = await Muscle.findOne({ _id }).lean();

    return { data: muscle as T };
  },

  create: async <T>(muscleToCreate: T) => {
    const muscle = new Muscle(muscleToCreate);

    await muscle.save();
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    checkInvalidId(_id);

    await Muscle.findOneAndReplace({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id: string) => {
    checkInvalidId(_id);

    await Muscle.findOneAndDelete({ _id });
  },
};
