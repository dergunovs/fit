import type { IMuscle, IMuscleService } from 'fitness-tracker-contracts';

import Muscle from './model.js';

export const muscleService: IMuscleService = {
  getAll: async () => {
    const muscles = await Muscle.find().sort('title').lean().exec();

    return { data: muscles as IMuscle[] };
  },

  getOne: async <T>(_id: string) => {
    const muscle: IMuscle | null = await Muscle.findOne({ _id }).lean().exec();

    return { data: muscle as T };
  },

  create: async <T>(muscleToCreate: T) => {
    const muscle = new Muscle(muscleToCreate);

    await muscle.save();
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    await Muscle.findOneAndReplace({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id: string) => {
    await Muscle.findOneAndDelete({ _id });
  },
};
