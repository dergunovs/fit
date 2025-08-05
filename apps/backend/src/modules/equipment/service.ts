import type { IEquipment, IEquipmentService, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { checkInvalidId } from '../common/helpers.js';
import Equipment from './model.js';

export const equipmentService: IEquipmentService = {
  getAll: async () => {
    const equipments = await Equipment.find().sort('title').lean();

    return { data: equipments as IEquipment[] };
  },

  getOne: async <T>(_id: string) => {
    checkInvalidId(_id);

    const equipment: IEquipment | null = await Equipment.findOne({ _id }).lean();

    return { data: equipment as T };
  },

  create: async <T>(equipmentToCreate: T, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const equipment = new Equipment({ ...equipmentToCreate, createdBy: user?._id });

    await equipment.save();
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    checkInvalidId(_id);

    await Equipment.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id: string) => {
    checkInvalidId(_id);

    await Equipment.findOneAndDelete({ _id });
  },
};
