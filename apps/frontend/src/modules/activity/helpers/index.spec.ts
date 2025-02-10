import { describe, expect, test } from 'vitest';

import {
  getPotentialActivityDuration,
  convertActivityCalendarEvents,
  generateActivityExercises,
  getToFailurePercent,
  getRestPercent,
  copyActivityToClipboard,
} from '.';

import { EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE } from '@/exercise/fixtures';
import {
  ACTIVITIES_CALENDAR_FIXTURE,
  ACTIVITY_CALENDAR_EVENTS,
  ACTIVITY_FIXTURE,
  EXERCISES_GENERATED,
} from '@/activity/fixtures';
import { spyCopyToClipboard, spyToastSuccess } from '@/common/mocks';

describe('activity helpers', () => {
  test('gets potential activity duration', async () => {
    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE)).toStrictEqual('-');

    expect(getPotentialActivityDuration(EXERCISES_DONE_FIXTURE, EXERCISES_STATISTICS_FIXTURE, 50)).toStrictEqual(
      '2 мин. 33 сек.'
    );
  });

  test('converts activity calendar events', async () => {
    expect(convertActivityCalendarEvents(ACTIVITIES_CALENDAR_FIXTURE)).toStrictEqual(ACTIVITY_CALENDAR_EVENTS);
  });

  test('generates activity exercises', async () => {
    expect(generateActivityExercises(EXERCISES_DONE_FIXTURE)).toStrictEqual(EXERCISES_GENERATED);
  });

  test('gets to failure percent', async () => {
    expect(getToFailurePercent(EXERCISES_DONE_FIXTURE)).toStrictEqual('50%');
  });

  test('gets rest percent', async () => {
    expect(
      getRestPercent(EXERCISES_DONE_FIXTURE, ACTIVITY_FIXTURE.dateCreated, ACTIVITY_FIXTURE.dateUpdated)
    ).toStrictEqual('98%');
  });

  test('copies activity to clipboard', async () => {
    await copyActivityToClipboard(EXERCISES_DONE_FIXTURE, ACTIVITY_FIXTURE.dateCreated, ACTIVITY_FIXTURE.dateUpdated);

    expect(spyCopyToClipboard).toBeCalledTimes(1);
    expect(spyCopyToClipboard).toBeCalledWith(`29 дек. 2024 г., длительность: 62 мин. 00 сек.
Подходы: 2, отказы: 50%, отдых: 98%.

1. Отжимание от скамьи x12 8кг 43 сек. ДО ОТКАЗА
2. Подтягивание x12  - 
`);

    expect(spyToastSuccess).toBeCalledTimes(1);
  });
});
