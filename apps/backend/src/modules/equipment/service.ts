import type { IEquipment, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import Equipment from './model.js';

export const equipmentService = {
  getAll: async () => {
    const equipments = await Equipment.find().sort('title').lean();

    return { data: equipments };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const equipment = await Equipment.findOne({ _id }).lean();

    if (!equipment) throw error.notFound();

    return { data: equipment };
  },

  create: async (equipmentToCreate: IEquipment, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    if (!user) throw error.notFound();

    await Equipment.create(equipmentToCreate);
  },

  update: async (_id: string, itemToUpdate: IEquipment) => {
    checkInvalidId(_id);

    await Equipment.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id: string) => {
    checkInvalidId(_id);

    await Equipment.findOneAndDelete({ _id });
  },
};
