import type { IPopulate } from '../common/types.ts';

export const EXERCISE_POPULATE: IPopulate[] = [
  { path: 'createdBy', select: '_id name email' },
  { path: 'equipment' },
  { path: 'equipmentForWeight' },
  { path: 'muscles' },
];

export const MAX_CUSTOM_EXERCISES = 21;
