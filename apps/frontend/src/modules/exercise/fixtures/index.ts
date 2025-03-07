import {
  EXERCISE_MUSCLE_GROUPS,
  IExercise,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
} from 'fitness-tracker-contracts';

import { USER_FIXTURE } from '@/user/fixtures';
import { EXERCISE_REPEATS_DEFAULT } from '@/exercise/constants';
import { EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';

export const EXERCISE_FIXTURE: IExercise = {
  _id: '1',
  title: 'Отжимание от скамьи',
  description: 'Описание 1',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[0], EXERCISE_MUSCLE_GROUPS[1]],
  isWeights: true,
  isWeightsRequired: true,
  equipment: EQUIPMENT_FIXTURE_2,
  equipmentForWeight: [EQUIPMENT_FIXTURE],
};

export const EXERCISE_FIXTURE_2: IExercise = {
  _id: '2',
  title: 'Подтягивание',
  description: 'Описание 2',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[2], EXERCISE_MUSCLE_GROUPS[3]],
  isWeights: false,
  isWeightsRequired: false,
};

export const EXERCISE_FIXTURE_3: IExercise = {
  _id: '3',
  title: 'Жим лёжа',
  description: 'Описание 3',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[4], EXERCISE_MUSCLE_GROUPS[5]],
  isWeights: true,
  isWeightsRequired: true,
};

export const EXERCISES_FIXTURE: IExercise[] = [EXERCISE_FIXTURE, EXERCISE_FIXTURE_2, EXERCISE_FIXTURE_3];

export const EXERCISE_CHOOSEN_FIXTURE: IExerciseChoosen = {
  _id: '1',
  exercise: EXERCISE_FIXTURE,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: 0,
};

export const EXERCISE_CHOOSEN_2_FIXTURE: IExerciseChoosen = {
  _id: '2',
  exercise: EXERCISE_FIXTURE_2,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: 0,
};

export const EXERCISES_CHOOSEN_FIXTURE: IExerciseChoosen[] = [EXERCISE_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_2_FIXTURE];

export const EXERCISE_DONE_FIXTURE: IExerciseDone = {
  _id: '1',
  exercise: EXERCISE_FIXTURE,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: 8,
  duration: 43,
  isToFailure: true,
  isDone: true,
  dateUpdated: new Date('2024-11-30T07:34:57.304Z'),
};

export const EXERCISE_NOT_DONE_FIXTURE: IExerciseDone = {
  _id: '2',
  exercise: EXERCISE_FIXTURE_2,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: 0,
  duration: undefined,
  isToFailure: undefined,
  isDone: false,
  dateUpdated: new Date('2024-11-30T07:37:57.304Z'),
};

export const EXERCISES_DONE_FIXTURE: IExerciseDone[] = [EXERCISE_DONE_FIXTURE, EXERCISE_NOT_DONE_FIXTURE];

export const EXERCISE_STATISTICS_FIXTURE: IExerciseStatistics = {
  exercise: EXERCISE_FIXTURE,
  sets: 35,
  setsDynamics: 74,
  repeats: 578,
  repeatsDynamics: 81,
  averageDuration: 3.0916955017301038,
  isUserEquipmentMatches: false,
};

export const EXERCISE_STATISTICS_FIXTURE_2: IExerciseStatistics = {
  exercise: EXERCISE_FIXTURE_2,
  sets: 30,
  setsDynamics: -10,
  repeats: 374,
  repeatsDynamics: -33,
  averageDuration: 3.27807486631016,
  isUserEquipmentMatches: true,
};

export const EXERCISES_STATISTICS_FIXTURE: IExerciseStatistics[] = [
  EXERCISE_STATISTICS_FIXTURE,
  EXERCISE_STATISTICS_FIXTURE_2,
];
