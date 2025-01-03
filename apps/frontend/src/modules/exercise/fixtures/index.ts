import {
  EXERCISE_MUSCLE_GROUPS,
  IExercise,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
} from 'fitness-tracker-contracts';

import { USER_FIXTURE } from '@/user/fixtures';
import { EXERCISE_REPEATS_DEFAULT } from '@/exercise/constants';

export const EXERCISE_FIXTURE: IExercise = {
  title: 'Отжимание от скамьи',
  _id: '1',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[0], EXERCISE_MUSCLE_GROUPS[1]],
  weights: [0, 9],
  defaultWeight: 9,
};

export const EXERCISE_FIXTURE_2: IExercise = {
  title: 'Подтягивание',
  _id: '2',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[2], EXERCISE_MUSCLE_GROUPS[3]],
  weights: [0, 9],
  defaultWeight: 0,
};

export const EXERCISE_FIXTURE_3: IExercise = {
  title: 'Жим лёжа',
  _id: '3',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[4], EXERCISE_MUSCLE_GROUPS[5]],
  weights: [9, 16],
  defaultWeight: 16,
};

export const EXERCISES_FIXTURE: IExercise[] = [EXERCISE_FIXTURE, EXERCISE_FIXTURE_2, EXERCISE_FIXTURE_3];

export const EXERCISE_CHOOSEN_FIXTURE: IExerciseChoosen = {
  _id: '1',
  exercise: EXERCISE_FIXTURE,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE.defaultWeight,
};

export const EXERCISE_CHOOSEN_2_FIXTURE: IExerciseChoosen = {
  _id: '2',
  exercise: EXERCISE_FIXTURE_2,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE_2.defaultWeight,
};

export const EXERCISES_CHOOSEN_FIXTURE: IExerciseChoosen[] = [EXERCISE_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_2_FIXTURE];

export const EXERCISE_DONE_FIXTURE: IExerciseDone = {
  _id: '1',
  exercise: EXERCISE_FIXTURE,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE.defaultWeight,
  duration: 43,
  isToFailure: true,
  isDone: true,
};

export const EXERCISE_NOT_DONE_FIXTURE: IExerciseDone = {
  _id: '2',
  exercise: EXERCISE_FIXTURE_2,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE_2.defaultWeight,
  duration: undefined,
  isToFailure: undefined,
  isDone: false,
};

export const EXERCISES_DONE_FIXTURE: IExerciseDone[] = [EXERCISE_DONE_FIXTURE, EXERCISE_NOT_DONE_FIXTURE];

export const EXERCISE_STATISTICS_FIXTURE: IExerciseStatistics = {
  _id: '1',
  title: 'Приседание',
  sets: 35,
  setsDynamics: 74,
  repeats: 578,
  repeatsDynamics: 81,
  averageDuration: 3.0916955017301038,
};

export const EXERCISE_STATISTICS_FIXTURE_2: IExerciseStatistics = {
  _id: '2',
  title: 'Отжимание',
  sets: 30,
  setsDynamics: -10,
  repeats: 374,
  repeatsDynamics: -33,
  averageDuration: 3.27807486631016,
};

export const EXERCISES_STATISTICS_FIXTURE: IExerciseStatistics[] = [
  EXERCISE_STATISTICS_FIXTURE,
  EXERCISE_STATISTICS_FIXTURE_2,
];
