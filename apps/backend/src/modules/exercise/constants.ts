import { IPopulate } from '../common/types.js';

export const EXERCISE_POPULATE: IPopulate[] = [
  { path: 'createdBy', select: '_id name email' },
  { path: 'equipment', select: '_id title title_en isWeights' },
  { path: 'equipmentForWeight', select: '_id title title_en isWeights' },
  { path: 'muscles', select: '_id title title_en color' },
];

export const EXERCISE_SELECT = [
  '_id',
  'title',
  'title_en',
  'description',
  'description_en',
  'equipment',
  'equipmentForWeight',
  'isWeights',
  'isWeightsRequired',
  'muscles',
  'isCustom',
].join(' ');
