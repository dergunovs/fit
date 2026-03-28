import type { IMuscle } from 'fitness-tracker-contracts';

import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { IMuscleRepository } from './repository.js';

export function createMuscleService(deps: { muscleRepository: IMuscleRepository }) {
  const { muscleRepository } = deps;

  return {
    getAll: async () => {
      const muscles = await muscleRepository.getAll();

      return { data: muscles };
    },

    getOne: async (_id: string) => {
      checkInvalidId(_id);

      const muscle = await muscleRepository.getOne(_id);

      if (!muscle) throw error.notFound();

      return { data: muscle };
    },

    create: async (muscleToCreate: IMuscle) => {
      await muscleRepository.create(muscleToCreate);
    },

    update: async (_id: string, itemToUpdate: IMuscle) => {
      checkInvalidId(_id);

      await muscleRepository.updateOne(_id, itemToUpdate);
    },

    delete: async (_id: string) => {
      checkInvalidId(_id);

      await muscleRepository.deleteOne(_id);
    },
  };
}
