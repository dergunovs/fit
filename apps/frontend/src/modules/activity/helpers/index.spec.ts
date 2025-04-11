import { describe, expect, test } from 'vitest';

import {
  getPotentialActivityDuration,
  convertActivityCalendarEvents,
  generateActivityExercises,
  getToFailurePercent,
  getRestPercent,
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
    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE, 'ru')).toStrictEqual('-');

    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE, 'ru', 50)).toStrictEqual(
      '2 мин. 33 сек.'
    );
  });

  test('converts activity calendar events', async () => {
    expect(convertActivityCalendarEvents(MUSCLES_FIXTURE, ACTIVITIES_CALENDAR_FIXTURE)).toStrictEqual(
      ACTIVITY_CALENDAR_EVENTS
    );
  });

  test('generates activity exercises', async () => {
    expect(generateActivityExercises(EXERCISES_DONE_FIXTURE)).toStrictEqual(EXERCISES_GENERATED);
  });

  test('gets to failure percent', async () => {
    expect(getToFailurePercent(EXERCISES_DONE_FIXTURE)).toStrictEqual('50%');
  });

  test('gets rest percent', async () => {
    expect(
      getRestPercent(EXERCISES_DONE_FIXTURE, 'ru', ACTIVITY_FIXTURE.dateCreated, ACTIVITY_FIXTURE.dateUpdated)
    ).toStrictEqual('98%');
  });
});
