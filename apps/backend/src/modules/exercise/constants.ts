import { IPopulate } from '../common/types.js';

export const EXERCISE_POPULATE: IPopulate[] = [
  { path: 'createdBy', select: '_id name email' },
  { path: 'equipment' },
  { path: 'equipmentForWeight' },
  { path: 'muscles' },
];
