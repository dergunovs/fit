import type { IExercise, IUser } from 'fitness-tracker-contracts';

import { paginate } from '../common/helpers.js';
import User from '../user/model.js';
import Exercise from './model.js';
import { EXERCISE_POPULATE } from './constants.js';

export interface IExerciseRepository {
  getMany: (page: number) => Promise<{ data: IExercise[]; total: number }>;
  getByUser: (user: IUser) => Promise<IExercise[]>;
  getOne: (_id: string) => Promise<IExercise | null>;
  countByUser: (user: IUser) => Promise<number>;
  create: (data: Partial<IExercise>) => Promise<void>;
  findExerciseById: (_id: string) => Promise<InstanceType<typeof Exercise> | null>;
  replaceOne: (exercise: InstanceType<typeof Exercise>, data: Partial<IExercise>) => Promise<void>;
  deleteOne: (exercise: InstanceType<typeof Exercise>) => Promise<void>;
  findAdminUser: () => Promise<IUser | null>;
}

export function createExerciseRepository(): IExerciseRepository {
  return {
    getMany: async (page: number) => {
      return paginate(Exercise, page, '-dateCreated', EXERCISE_POPULATE);
    },

    getByUser: async (user: IUser) => {
      return Exercise.find({ createdBy: user }).sort('title').populate(EXERCISE_POPULATE).lean();
    },

    getOne: async (_id: string) => {
      return Exercise.findOne({ _id }).populate(EXERCISE_POPULATE).lean();
    },

    countByUser: async (user: IUser) => {
      return Exercise.countDocuments({ createdBy: user });
    },

    create: async (data: Partial<IExercise>) => {
      await Exercise.create(data);
    },

    findExerciseById: async (_id: string) => {
      return Exercise.findOne({ _id });
    },

    replaceOne: async (exercise: InstanceType<typeof Exercise>, data: Partial<IExercise>) => {
      await exercise.replaceOne({ ...data, dateUpdated: new Date() });
      await exercise.save();
    },

    deleteOne: async (exercise: InstanceType<typeof Exercise>) => {
      await exercise.deleteOne();
    },

    findAdminUser: async () => {
      return User.findOne({ role: 'admin' }).lean();
    },
  };
}
