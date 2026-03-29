import type { IPopulate } from '../common/types.ts';

export const USER_POPULATE: IPopulate[] = [
  { path: 'equipments.equipment' },
  {
    path: 'templates.exercises.exercise',
    select: '_id title title_en muscles createdBy isWeights isWeightsRequired equipmentForWeight',
    populate: [
      { path: 'createdBy', select: '_id name email' },
      { path: 'muscles', select: '_id title color' },
      { path: 'equipmentForWeight', select: '_id title isWeights' },
    ],
  },
];
