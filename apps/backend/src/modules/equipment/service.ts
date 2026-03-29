import type { IEquipment } from 'fitness-tracker-contracts';

import { error } from '../common/errorHandler.ts';
import { checkInvalidId } from '../common/helpers.ts';
import type { IEquipmentRepository } from './repository.ts';

export function createEquipmentService(deps: { equipmentRepository: IEquipmentRepository }) {
  const { equipmentRepository } = deps;

  return {
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

    create: async (equipmentToCreate: IEquipment) => {
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
}
