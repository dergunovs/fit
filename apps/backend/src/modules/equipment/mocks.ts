import mongoose from 'mongoose';
import { IEquipment } from 'fitness-tracker-contracts';

import { createMockRepository } from '../common/test/mockFactories.js';
import { IEquipmentRepository } from './repository.js';

export const equipmentId = new mongoose.Types.ObjectId().toString();

export const mockEquipment: IEquipment = {
  _id: equipmentId,
  title: 'Mat',
  isWeights: false,
};

export const mockEquipmentForWeight: IEquipment = {
  _id: new mongoose.Types.ObjectId().toString(),
  title: 'Dumbbells',
  isWeights: true,
};

export const mockEquipmentRepository = {
  ...createMockRepository<IEquipmentRepository>(['getAll', 'getOne', 'create', 'updateOne', 'deleteOne']),
} satisfies IEquipmentRepository;
