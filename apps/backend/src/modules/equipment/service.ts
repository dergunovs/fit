import type { IEquipment, TDecode } from 'fitness-tracker-contracts';

import { getAuthenticatedUser } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { equipmentRepository } from './repository.js';

export const equipmentService = {
  getAll: async () => {
    const equipments = await equipmentRepository.getAll();

    return { data: equipments };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const equipment = await equipmentRepository.getOne(_id);

    if (!equipment) throw error.notFound();

    return { data: equipment };
  },

  create: async (equipmentToCreate: IEquipment, decode?: TDecode, token?: string) => {
    getAuthenticatedUser(decode, token);

    await equipmentRepository.create(equipmentToCreate);
  },

  update: async (_id: string, itemToUpdate: IEquipment) => {
    checkInvalidId(_id);

    await equipmentRepository.updateOne(_id, itemToUpdate);
  },

  delete: async (_id: string) => {
    checkInvalidId(_id);

    await equipmentRepository.deleteOne(_id);
  },
};
