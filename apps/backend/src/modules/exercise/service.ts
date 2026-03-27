import type { IExercise, TDecode } from 'fitness-tracker-contracts';

import { getAuthenticatedUser, allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { exerciseRepository } from './repository.js';
import { MAX_CUSTOM_EXERCISES } from './constants.js';

export const exerciseService = {
  getMany: async (page: number) => {
    const { data, total } = await exerciseRepository.getMany(page);

    return { data, total };
  },

  getAll: async (decode?: TDecode, token?: string) => {
    const [admin, user] = await Promise.all([
      exerciseRepository.findAdminUser(),
      Promise.resolve(getAuthenticatedUser(decode, token)),
    ]);

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

  getCustom: async (decode?: TDecode, token?: string) => {
    const user = getAuthenticatedUser(decode, token);

    const exercises = await exerciseRepository.getByUser(user);

    return { data: exercises };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const exercise = await exerciseRepository.getOne(_id);

    if (!exercise) throw error.notFound();

    return { data: exercise };
  },

  create: async (exerciseToCreate: IExercise, decode?: TDecode, token?: string) => {
    const user = getAuthenticatedUser(decode, token);

    const exercisesCount = user.role === 'admin' ? 1 : await exerciseRepository.countByUser(user);

    const isAllowToCreateExercise = user.role === 'admin' || exercisesCount < MAX_CUSTOM_EXERCISES;

    if (!isAllowToCreateExercise) throw error.forbidden();

    await exerciseRepository.create({ ...exerciseToCreate, createdBy: user, isCustom: user.role !== 'admin' });
  },

  update: async (_id: string, itemToUpdate: IExercise, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await exerciseRepository.findExerciseById(_id);

    if (!exercise?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exerciseRepository.replaceOne(exercise, itemToUpdate);
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const exercise = await exerciseRepository.findExerciseById(_id);

    if (!exercise?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(exercise.createdBy._id, decode, token);

    await exerciseRepository.deleteOne(exercise);
  },
};
