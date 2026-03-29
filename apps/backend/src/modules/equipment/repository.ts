import type { IEquipment } from 'fitness-tracker-contracts';

import Equipment from './model.ts';

export interface IEquipmentRepository {
  getAll: () => Promise<IEquipment[]>;
  getOne: (_id: string) => Promise<IEquipment | null>;
  create: (equipmentToCreate: IEquipment) => Promise<void>;
  updateOne: (_id: string, data: IEquipment) => Promise<void>;
  deleteOne: (_id: string) => Promise<void>;
}

export function createEquipmentRepository(): IEquipmentRepository {
  return {
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
}
