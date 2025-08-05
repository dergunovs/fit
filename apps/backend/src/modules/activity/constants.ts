import { IPopulate } from '../common/types.js';

export const ACTIVITY_POPULATE: IPopulate[] = [
  {
    path: 'exercises.exercise',
    select: ['_id', 'title', 'title_en', 'muscles', 'createdBy'],
    populate: [
      { path: 'createdBy', select: ['_id', 'name', 'email'] },
      { path: 'muscles', select: ['_id', 'title', 'color'] },
    ],
  },
  { path: 'createdBy', select: ['_id', 'name', 'email'] },
];
