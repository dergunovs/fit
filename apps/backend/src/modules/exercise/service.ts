import type { IExercise, IExerciseService } from 'fitness-tracker-contracts';

import Exercise from './model.js';

export const exerciseService: IExerciseService = {
  getAll: async () => {
    const data = await Exercise.find().sort('title');

    return data as IExercise[];
  },

  getOne: async <T>(_id: string) => {
    const exercise: IExercise | null = await Exercise.findOne({ _id }).lean().exec();

    return { data: exercise as T };
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    await Exercise.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  create: async <T>(exerciseToCreate: T) => {
    const exercise = new Exercise(exerciseToCreate);

    await exercise.save();
  },

  delete: async (_id?: string) => {
    const exercise = await Exercise.findOne({ _id });

    await exercise?.deleteOne();
  },
};
