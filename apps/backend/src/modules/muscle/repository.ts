import type { IMuscle } from 'fitness-tracker-contracts';

import Muscle from './model.js';

export interface IMuscleRepository {
  getAll: () => Promise<IMuscle[]>;
  findAll: () => Promise<IMuscle[]>;
  getOne: (_id: string) => Promise<IMuscle | null>;
  create: (muscleToCreate: IMuscle) => Promise<void>;
  updateOne: (_id: string, data: IMuscle) => Promise<void>;
  deleteOne: (_id: string) => Promise<void>;
}

export function createMuscleRepository(): IMuscleRepository {
  return {
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
}
