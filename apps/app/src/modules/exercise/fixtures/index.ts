import { EXERCISE_MUSCLE_GROUPS, IExercise } from 'fitness-tracker-contracts';
import { USER_FIXTURE } from '@/user/fixtures';

export const EXERCISE_FIXTURE: IExercise = {
  title: 'Отжимание от скамьи',
  _id: '1',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[0], EXERCISE_MUSCLE_GROUPS[1]],
};

export const EXERCISE_FIXTURE_2 = {
  title: 'Подтягивание',
  _id: '2',
  createdBy: USER_FIXTURE,
  muscleGroups: [EXERCISE_MUSCLE_GROUPS[2], EXERCISE_MUSCLE_GROUPS[3]],
};

export const EXERCISE_FIXTURES = [EXERCISE_FIXTURE, EXERCISE_FIXTURE_2];
