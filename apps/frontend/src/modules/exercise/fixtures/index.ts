import { EXERCISE_MUSCLE_GROUPS, IExercise } from 'fitness-tracker-contracts';

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

export const EXERCISE_FIXTURE_2 = {
  title: 'Подтягивание',
  _id: '2',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[2], EXERCISE_MUSCLE_GROUPS[3]],
  weights: [0, 9],
  defaultWeight: 0,
};

export const EXERCISE_FIXTURE_3 = {
  title: 'Жим лёжа',
  _id: '3',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[4], EXERCISE_MUSCLE_GROUPS[5]],
  weights: [9, 16],
  defaultWeight: 16,
};

export const EXERCISES_FIXTURE = [EXERCISE_FIXTURE, EXERCISE_FIXTURE_2, EXERCISE_FIXTURE_3];

export const EXERCISE_CHOOSEN_FIXTURE = {
  _id: '1',
  exercise: EXERCISE_FIXTURE,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE.defaultWeight,
};

export const EXERCISE_CHOOSEN_2_FIXTURE = {
  _id: '2',
  exercise: EXERCISE_FIXTURE_2,
  repeats: EXERCISE_REPEATS_DEFAULT,
  weight: EXERCISE_FIXTURE_2.defaultWeight,
};

export const EXERCISES_CHOOSEN_FIXTURE = [EXERCISE_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_2_FIXTURE];
