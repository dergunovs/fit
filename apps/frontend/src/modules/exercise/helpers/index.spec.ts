import { describe, expect, test } from 'vitest';

import {
  getAverageDuration,
  generateMuscleGroupStatistics,
  isPrevExerciseSame,
  isSetCreatable,
  getExercisePassingTitle,
  generateTimeline,
  filterExercisesByTitleAndMuscleGroup,
  getAvailableExerciseWeights,
  getExercisesToChooseDefaultWeight,
  getDefaultExerciseWeight,
} from '.';
import {
  EXERCISES_DONE_FIXTURE,
  EXERCISES_FIXTURE,
  EXERCISE_FIXTURE,
  EXERCISE_FIXTURE_2,
  EXERCISE_FIXTURE_3,
  EXERCISE_STATISTICS_FIXTURE,
} from '@/exercise/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';

describe('exercise helpers', () => {
  test('gets average duration', async () => {
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'set')).toStrictEqual('51.1с');
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'repeat')).toStrictEqual('3.1с');
  });

  test('generates muscle group statistics', async () => {
    const muscleGroupStatistics = [
      { repeats: 12, sets: 1, title: 'Плечи', color: '#d10000' },
      { repeats: 12, sets: 1, title: 'Руки', color: '#a83cff' },
      { repeats: 12, sets: 1, title: 'Грудь', color: '#00f7e3' },
      { repeats: 12, sets: 1, title: 'Пресс', color: '#00a934' },
    ];

    expect(generateMuscleGroupStatistics(EXERCISES_DONE_FIXTURE)).toStrictEqual(muscleGroupStatistics);
  });

  test('checks is prev exercise same', async () => {
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(false);
  });

  test('checks is set creatable', async () => {
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(true);
  });

  test('gets exercise passing title', async () => {
    expect(getExercisePassingTitle(1, true, 2, EXERCISES_DONE_FIXTURE[0])).toStrictEqual(
      '1 из 2. Отжимание от скамьи 8 кг.'
    );

    expect(getExercisePassingTitle(2, true, 2, EXERCISES_DONE_FIXTURE[1])).toStrictEqual('2 из 2. Подтягивание.');
    expect(getExercisePassingTitle(2, false, 2, EXERCISES_DONE_FIXTURE[1])).toStrictEqual('2. Подтягивание.');
  });

  test('generates timeline', async () => {
    const timeline = [{ left: 0, right: 6, type: 'exercise' }];

    expect(generateTimeline(EXERCISES_DONE_FIXTURE, new Date('2024-11-30T07:33:57.304Z'), 10000)).toStrictEqual(
      timeline
    );
  });

  test('filter exercises by title and muscle group', async () => {
    expect(filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', '')).toStrictEqual([
      EXERCISE_FIXTURE_2,
      EXERCISE_FIXTURE_3,
    ]);

    expect(filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', '', USER_FIXTURE)).toStrictEqual(
      EXERCISES_FIXTURE
    );

    const title = EXERCISE_FIXTURE_2.title;

    expect(filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, title, '', USER_FIXTURE)).toStrictEqual([
      EXERCISE_FIXTURE_2,
    ]);

    const muscleGroup = EXERCISE_FIXTURE_2.muscleGroups?.[1]._id || '';

    expect(filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', muscleGroup, USER_FIXTURE)).toStrictEqual([
      EXERCISE_FIXTURE_2,
    ]);
  });

  test('gets available exercise weights', async () => {
    expect(getAvailableExerciseWeights(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual([1, 2, 3]);
  });

  test('gets exercises to choose default weight', async () => {
    expect(getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, USER_FIXTURE.equipments)).toStrictEqual([
      { _id: '1', options: [1, 2, 3], title: 'Отжимание от скамьи' },
    ]);
  });

  test('gets default exercise weight', async () => {
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual(0);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [])).toStrictEqual(0);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [1, 2, 3])).toStrictEqual(1);
  });
});
