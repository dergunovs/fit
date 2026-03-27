import type { IEquipment } from 'fitness-tracker-contracts';

import Equipment from './model.js';

export const equipmentRepository = {
  getAll: async () => {
    return Equipment.find().sort('title').lean();
  },

  getOne: async (_id: string) => {
    return Equipment.findOne({ _id }).lean();
  },

  create: async (equipmentToCreate: IEquipment) => {
    await Equipment.create(equipmentToCreate);
  },

  updateOne: async (_id: string, data: IEquipment) => {
    await Equipment.findOneAndUpdate({ _id }, { ...data, dateUpdated: new Date() });
  },

  deleteOne: async (_id: string) => {
    await Equipment.findOneAndDelete({ _id });
  },
};
