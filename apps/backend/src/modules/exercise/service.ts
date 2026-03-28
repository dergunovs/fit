import type { IExercise, IUser } from 'fitness-tracker-contracts';

import { allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { MAX_CUSTOM_EXERCISES } from './constants.js';
import { IExerciseRepository } from './repository.js';

export function createExerciseService(deps: { exerciseRepository: IExerciseRepository }) {
  const { exerciseRepository } = deps;

  return {
    getMany: async (page: number) => {
      const { data, total } = await exerciseRepository.getMany(page);

      return { data, total };
    },

    getAll: async (user: IUser) => {
      const admin = await exerciseRepository.findAdminUser();

      if (!admin) throw error.notFound();

      if (user.role === 'admin') {
        const exercises = await exerciseRepository.getByUser(admin);

        return { data: exercises };
      }

      const [adminExercises, userExercises] = await Promise.all([
        exerciseRepository.getByUser(admin),
        exerciseRepository.getByUser(user),
      ]);

      return { data: [...userExercises, ...adminExercises] };
    },

    getCustom: async (user: IUser) => {
      const exercises = await exerciseRepository.getByUser(user);

      return { data: exercises };
    },

    getOne: async (_id: string) => {
      checkInvalidId(_id);

      const exercise = await exerciseRepository.getOne(_id);

      if (!exercise) throw error.notFound();

      return { data: exercise };
    },

    create: async (exerciseToCreate: IExercise, user: IUser) => {
      const exercisesCount = user.role === 'admin' ? 1 : await exerciseRepository.countByUser(user);

      const isAllowToCreateExercise = user.role === 'admin' || exercisesCount < MAX_CUSTOM_EXERCISES;

      if (!isAllowToCreateExercise) throw error.forbidden();

      await exerciseRepository.create({ ...exerciseToCreate, createdBy: user, isCustom: user.role !== 'admin' });
    },

    update: async (_id: string, itemToUpdate: IExercise, user: IUser) => {
      checkInvalidId(_id);

      const exercise = await exerciseRepository.findExerciseById(_id);

      if (!exercise?.createdBy?._id) throw error.notFound();

      allowAccessToAdminAndCurrentUser(exercise.createdBy._id, user);

      await exerciseRepository.replaceOne(exercise, itemToUpdate);
    },

    delete: async (_id: string, user: IUser) => {
      checkInvalidId(_id);

      const exercise = await exerciseRepository.findExerciseById(_id);

      if (!exercise?.createdBy?._id) throw error.notFound();

      allowAccessToAdminAndCurrentUser(exercise.createdBy._id, user);

      await exerciseRepository.deleteOne(exercise);
    },
  };
}
