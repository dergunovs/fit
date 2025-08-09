import { describe, expect, test } from 'vitest';

import {
  getAverageDuration,
  getAverageRepeatsInSet,
  isPrevExerciseSame,
  isSetCreatable,
  getExercisePassingTitle,
  generateTimeline,
  filterExercisesByTitleAndMuscle,
  getAvailableExerciseWeights,
  getExercisesToChooseDefaultWeight,
  getDefaultExerciseWeight,
  isUserEquipmentMatches,
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
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'set')).toStrictEqual('51.1');
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'repeat')).toStrictEqual('3.1');
  });

  test('gets average repeats in set', async () => {
    expect(getAverageRepeatsInSet(12, 2)).toStrictEqual(12 / 2);
    expect(getAverageRepeatsInSet(13, 2)).toStrictEqual(7);
    expect(getAverageRepeatsInSet()).toStrictEqual(0);
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
    expect(getExercisePassingTitle(1, true, 2, EXERCISES_DONE_FIXTURE[0], 'кг', 'ru')).toStrictEqual(
      '1 - 2. Отжимание от скамьи 8 кг.'
    );

    expect(getExercisePassingTitle(2, true, 2, EXERCISES_DONE_FIXTURE[1], 'кг', 'ru')).toStrictEqual(
      '2 - 2. Подтягивание.'
    );
    expect(getExercisePassingTitle(2, false, 2, EXERCISES_DONE_FIXTURE[1], 'кг', 'ru')).toStrictEqual(
      '2. Подтягивание.'
    );
  });

  test('generates timeline', async () => {
    const timeline = [{ left: 0, right: 6, type: 'exercise' }];

    expect(generateTimeline(EXERCISES_DONE_FIXTURE, new Date('2024-11-30T07:33:57.304Z'), 10000)).toStrictEqual(
      timeline
    );
  });

  test('filter exercises by title and muscle group', async () => {
    expect(filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', '')).toStrictEqual([
      EXERCISE_FIXTURE_2,
      EXERCISE_FIXTURE_3,
    ]);

    expect(filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', '', USER_FIXTURE)).toStrictEqual(EXERCISES_FIXTURE);

    const title = EXERCISE_FIXTURE_2.title;

    expect(filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, title, '', USER_FIXTURE)).toStrictEqual([
      EXERCISE_FIXTURE_2,
    ]);

    const muscleGroup = EXERCISE_FIXTURE_2.muscles?.[1]._id || '';

    expect(filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', muscleGroup, USER_FIXTURE)).toStrictEqual([
      EXERCISE_FIXTURE_2,
    ]);
  });

  test('gets available exercise weights', async () => {
    expect(getAvailableExerciseWeights(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual([1, 2, 3]);
  });

  test('gets exercises to choose default weight', async () => {
    expect(getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, USER_FIXTURE.equipments)).toStrictEqual([
      { _id: '1', options: [1, 2, 3], title: 'Отжимание от скамьи', title_en: undefined },
    ]);
  });

  test('gets default exercise weight', async () => {
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual(1);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [])).toStrictEqual(1);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [1, 2, 3])).toStrictEqual(1);
  });

  test('checks is user equipment matches for exercise', async () => {
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE_2, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE_3, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE)).toStrictEqual(false);
  });
});
