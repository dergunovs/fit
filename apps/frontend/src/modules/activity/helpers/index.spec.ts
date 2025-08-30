import { describe, expect, test } from 'vitest';
import { IExercise } from 'fitness-tracker-contracts';

import {
  getPotentialActivityDuration,
  convertActivityCalendarEvents,
  generateActivityExercises,
  getToFailurePercent,
  getRestPercent,
  getActivityColor,
} from '.';

import { EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE } from '@/exercise/fixtures';
import {
  ACTIVITIES_CALENDAR_FIXTURE,
  ACTIVITY_CALENDAR_EVENTS,
  ACTIVITY_FIXTURE,
  EXERCISES_GENERATED,
} from '@/activity/fixtures';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

describe('activity helpers', () => {
  test('gets potential activity duration', async () => {
    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, 'ru', EXERCISES_STATISTICS_FIXTURE)).toStrictEqual('-');

    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, 'ru', EXERCISES_STATISTICS_FIXTURE, 50)).toStrictEqual(
      '2 мин. 33 сек.'
    );

    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, 'ru')).toStrictEqual('-');

    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, 'ru', undefined, 50)).toStrictEqual('-');
  });

  test('converts activity calendar events', async () => {
    expect(convertActivityCalendarEvents(MUSCLES_FIXTURE, ACTIVITIES_CALENDAR_FIXTURE)).toStrictEqual(
      ACTIVITY_CALENDAR_EVENTS
    );

    expect(convertActivityCalendarEvents(MUSCLES_FIXTURE)).toBeUndefined();
  });

  test('generates activity exercises', async () => {
    expect(generateActivityExercises(EXERCISES_DONE_FIXTURE)).toStrictEqual(EXERCISES_GENERATED);

    expect(generateActivityExercises([])).toStrictEqual([]);
  });

  test('gets to failure percent', async () => {
    expect(getToFailurePercent(EXERCISES_DONE_FIXTURE)).toStrictEqual('50%');

    const exercisesAllNotToFailure = [
      { ...EXERCISES_DONE_FIXTURE[0], isToFailure: false },
      { ...EXERCISES_DONE_FIXTURE[1], isToFailure: false },
    ];

    expect(getToFailurePercent(exercisesAllNotToFailure)).toStrictEqual('0%');

    const exercisesAllToFailure = [
      { ...EXERCISES_DONE_FIXTURE[0], isToFailure: true },
      { ...EXERCISES_DONE_FIXTURE[1], isToFailure: true },
    ];

    expect(getToFailurePercent(exercisesAllToFailure)).toStrictEqual('100%');

    expect(getToFailurePercent([])).toStrictEqual('0%');
  });

  test('gets rest percent', async () => {
    expect(
      getRestPercent(EXERCISES_DONE_FIXTURE, 'ru', ACTIVITY_FIXTURE.dateCreated, ACTIVITY_FIXTURE.dateUpdated)
    ).toStrictEqual('98%');

    expect(getRestPercent([EXERCISES_DONE_FIXTURE[0]], 'ru')).toStrictEqual('0%');

    expect(getRestPercent([], 'ru')).toStrictEqual('0%');
  });

  test('gets activity color', async () => {
    const futureDate = new Date(Date.now() + 86400000);

    expect(getActivityColor(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, false, futureDate)).toBe('gray');

    const pastDate = new Date(Date.now() - 86400000);

    expect(getActivityColor(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, false, pastDate)).toBe('darkred');

    expect(getActivityColor(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, false)).toBe('black');

    expect(getActivityColor(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, true)).toBe(
      'linear-gradient(135deg, #00CED1 33%, #000080 33%, #000080 66%, #C41E3A 66%, #C41E3A 99%)'
    );

    const musclesWithTwoColors = [MUSCLES_FIXTURE[0], MUSCLES_FIXTURE[1]];

    const exercisesWithTwoMuscles = [
      {
        ...EXERCISES_DONE_FIXTURE[0],
        exercise: { ...EXERCISES_DONE_FIXTURE[0].exercise, muscles: [MUSCLES_FIXTURE[0]] } as IExercise,
      },
      {
        ...EXERCISES_DONE_FIXTURE[1],
        exercise: { ...EXERCISES_DONE_FIXTURE[1].exercise, muscles: [MUSCLES_FIXTURE[1]] } as IExercise,
      },
    ];

    expect(getActivityColor(exercisesWithTwoMuscles, musclesWithTwoColors, true)).toBe(
      'linear-gradient(135deg, #00CED1 50%, #000080 50%, #000080 100%)'
    );
  });
});
