import type { IMuscle } from 'fitness-tracker-contracts';

import Muscle from './model.js';

export const muscleRepository = {
  getAll: async () => {
    return Muscle.find().sort('title').lean();
  },

  findAll: async () => {
    return Muscle.find().lean();
  },

  getOne: async (_id: string) => {
    return Muscle.findOne({ _id }).lean();
  },

  create: async (muscleToCreate: IMuscle) => {
    await Muscle.create(muscleToCreate);
  },

  updateOne: async (_id: string, data: IMuscle) => {
    await Muscle.findOneAndReplace({ _id }, { ...data, dateUpdated: new Date() });
  },

  deleteOne: async (_id: string) => {
    await Muscle.findOneAndDelete({ _id });
  },
};
