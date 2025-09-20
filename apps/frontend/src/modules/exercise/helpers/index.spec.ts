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
  getUserEquipmentParams,
  addSetToExercises,
  updateExercisesIndex,
} from '.';
import {
  EXERCISES_CHOOSEN_FIXTURE,
  EXERCISES_DONE_FIXTURE,
  EXERCISES_FIXTURE,
  EXERCISE_FIXTURE,
  EXERCISE_FIXTURE_2,
  EXERCISE_FIXTURE_3,
  EXERCISE_STATISTICS_FIXTURE,
} from '@/exercise/fixtures';
import { USER_FIXTURE, USER_FIXTURE_2 } from '@/user/fixtures';
import { EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';

describe('exercise helpers', () => {
  test('gets average duration', async () => {
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'set')).toStrictEqual('51.1');
    expect(getAverageDuration(EXERCISE_STATISTICS_FIXTURE, 'repeat')).toStrictEqual('3.1');
  });

  test('gets average repeats in set', async () => {
    expect(getAverageRepeatsInSet(12, 2)).toStrictEqual(12 / 2);
    expect(getAverageRepeatsInSet(13, 2)).toStrictEqual(7);
    expect(getAverageRepeatsInSet()).toStrictEqual(0);
    expect(getAverageRepeatsInSet(0, 2)).toStrictEqual(0);
    expect(getAverageRepeatsInSet(10, 0)).toStrictEqual(0);
  });

  test('checks is prev exercise same', async () => {
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(false);
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 1)).toStrictEqual(false);
    expect(isPrevExerciseSame(EXERCISES_DONE_FIXTURE, 0, 'non-existent-id')).toStrictEqual(false);
  });

  test('checks is set creatable', async () => {
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 0, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[0]._id)).toStrictEqual(false);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 1, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(true);
    expect(isSetCreatable(EXERCISES_DONE_FIXTURE, 2, EXERCISES_DONE_FIXTURE[1]._id)).toStrictEqual(false);
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
    expect(getExercisePassingTitle(3, true, 5, EXERCISES_DONE_FIXTURE[0], 'lbs', 'en')).toStrictEqual(
      '3 - 5. Bench Press 8 lbs.'
    );
  });

  test('generates timeline', async () => {
    const timeline = [{ left: 0, right: 6, type: 'exercise' }];

    expect(generateTimeline(EXERCISES_DONE_FIXTURE, new Date('2024-11-30T07:33:57.304Z'), 10000)).toStrictEqual(
      timeline
    );

    expect(generateTimeline(EXERCISES_DONE_FIXTURE, null, 10000)).toStrictEqual([]);

    const exercisesWithUndefined = [{ ...EXERCISES_DONE_FIXTURE[0], dateUpdated: undefined, duration: undefined }];

    expect(generateTimeline(exercisesWithUndefined, new Date('2024-11-30T07:33:57.304Z'), 10000)).toStrictEqual([]);
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

    expect(filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', 'non-existent-muscle', USER_FIXTURE)).toStrictEqual(
      []
    );
  });

  test('gets available exercise weights', async () => {
    expect(getAvailableExerciseWeights(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual([1, 2, 3]);
    expect(getAvailableExerciseWeights(EXERCISE_FIXTURE_2, USER_FIXTURE_2)).toStrictEqual([]);
    expect(getAvailableExerciseWeights(EXERCISE_FIXTURE_2, USER_FIXTURE)).toStrictEqual([]);
  });

  test('gets exercises to choose default weight', async () => {
    expect(getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, [])).toStrictEqual([]);

    expect(getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, USER_FIXTURE.equipments)).toStrictEqual([
      { _id: '1', options: [1, 2, 3], title: 'Отжимание от скамьи', title_en: 'Bench Press' },
    ]);
    expect(
      getExercisesToChooseDefaultWeight([EXERCISE_FIXTURE_2, EXERCISE_FIXTURE_3], USER_FIXTURE.equipments)
    ).toStrictEqual([]);
  });

  test('gets default exercise weight', async () => {
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual(1);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [])).toStrictEqual(1);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, [1, 2, 3])).toStrictEqual(1);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE_2, USER_FIXTURE)).toStrictEqual(0);
    expect(getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE_2)).toStrictEqual(0);
  });

  test('checks is user equipment matches for exercise', async () => {
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE_2, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE_3, USER_FIXTURE)).toStrictEqual(true);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE)).toStrictEqual(false);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE, USER_FIXTURE_2)).toStrictEqual(false);
    expect(isUserEquipmentMatches(EXERCISE_FIXTURE_2, USER_FIXTURE_2)).toStrictEqual(true);

    const exerciseWithEquipmentNoWeights = {
      ...EXERCISE_FIXTURE,
      equipment: EQUIPMENT_FIXTURE_2,
      isWeightsRequired: false,
      equipmentForWeight: [],
    };

    expect(isUserEquipmentMatches(exerciseWithEquipmentNoWeights, USER_FIXTURE)).toStrictEqual(true);

    const exerciseWithoutEquipmentButWithWeight = {
      ...EXERCISE_FIXTURE_2,
      equipment: undefined,
      equipmentForWeight: [EQUIPMENT_FIXTURE],
      isWeightsRequired: true,
    };

    expect(isUserEquipmentMatches(exerciseWithoutEquipmentButWithWeight, USER_FIXTURE)).toStrictEqual(true);

    const exerciseWithoutEquipmentNoWeights = {
      ...EXERCISE_FIXTURE_2,
      equipment: undefined,
      equipmentForWeight: [],
      isWeightsRequired: false,
    };

    expect(isUserEquipmentMatches(exerciseWithoutEquipmentNoWeights, USER_FIXTURE)).toStrictEqual(true);
  });

  test('gets user equipment params', async () => {
    expect(getUserEquipmentParams(EXERCISE_FIXTURE, USER_FIXTURE)).toStrictEqual({
      isExerciseHasEquipment: true,
      isExerciseHasEquipmentForWeight: true,
      isWeightsRequired: true,
      isUserHasEquipment: true,
      isUserHasEquipmentForWeight: true,
    });

    expect(getUserEquipmentParams(EXERCISE_FIXTURE_2, USER_FIXTURE)).toStrictEqual({
      isExerciseHasEquipment: false,
      isExerciseHasEquipmentForWeight: false,
      isWeightsRequired: false,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    });

    expect(getUserEquipmentParams(EXERCISE_FIXTURE_3, USER_FIXTURE)).toStrictEqual({
      isExerciseHasEquipment: false,
      isExerciseHasEquipmentForWeight: false,
      isWeightsRequired: true,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    });

    expect(getUserEquipmentParams(EXERCISE_FIXTURE_2, USER_FIXTURE_2)).toStrictEqual({
      isExerciseHasEquipment: false,
      isExerciseHasEquipmentForWeight: false,
      isWeightsRequired: false,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    });

    expect(getUserEquipmentParams(EXERCISE_FIXTURE)).toStrictEqual({
      isExerciseHasEquipment: true,
      isExerciseHasEquipmentForWeight: true,
      isWeightsRequired: true,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    });
  });

  test('adds set to exercises', async () => {
    const result = addSetToExercises(EXERCISES_CHOOSEN_FIXTURE);

    expect(result).toHaveLength(4);
    expect(result[0]).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[0]);
    expect(result[1]).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[1]);
    expect(result[2].exercise).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[0].exercise);
    expect(result[3].exercise).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[1].exercise);
  });

  test('updates exercises index', async () => {
    const result = updateExercisesIndex(EXERCISES_CHOOSEN_FIXTURE, 1);

    expect(result).toHaveLength(2);
    expect(result[0]).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[1]);
    expect(result[1]).toStrictEqual(EXERCISES_CHOOSEN_FIXTURE[0]);
  });
});
