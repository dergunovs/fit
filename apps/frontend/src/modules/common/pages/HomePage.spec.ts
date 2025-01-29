import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, setAuth } from 'mhz-helpers';

import HomePage from './HomePage.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_STATISTICS_FIXTURE, ACTIVITIES_CALENDAR_FIXTURE } from '@/activity/fixtures';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import {
  spyUseActivityCalendar,
  spyGetActivitiesCalendar,
  mockDateFrom,
  mockDateTo,
  mockIsDatesReady,
  spyUpdateDates,
  spyGetActivitiesStatistics,
} from '@/activity/mocks';
import { convertActivityCalendarEvents } from '@/activity/helpers';

const hero = dataTest('hero');
const activityCalendar = dataTest('activity-calendar');
const activityStatistics = dataTest('activity-statistics');
const exerciseStatistics = dataTest('exercise-statistics');

let wrapper: VueWrapper<InstanceType<typeof HomePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(HomePage);
});

enableAutoUnmount(afterEach);

describe('HomePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(HomePage)).toBeTruthy();
  });

  it('gets and formats activity calendar data', async () => {
    expect(spyUseActivityCalendar).toBeCalledTimes(1);

    expect(spyGetActivitiesCalendar).toBeCalledTimes(1);
    expect(spyGetActivitiesCalendar).toBeCalledWith({ enabled: mockIsDatesReady }, mockDateFrom, mockDateTo);

    expect(wrapper.findComponent<typeof ActivityCalendar>(activityCalendar).vm.$props.events).toStrictEqual(
      convertActivityCalendarEvents(ACTIVITIES_CALENDAR_FIXTURE)
    );
  });

  it('updates dates on ready and update activity calendar events', async () => {
    expect(spyUpdateDates).toBeCalledTimes(0);

    wrapper.findComponent<typeof ActivityCalendar>(activityCalendar).vm.$emit('ready');

    expect(spyUpdateDates).toBeCalledTimes(1);

    wrapper.findComponent<typeof ActivityCalendar>(activityCalendar).vm.$emit('update');

    expect(spyUpdateDates).toBeCalledTimes(2);
  });

  it('gets activity statistics', async () => {
    expect(spyGetActivitiesStatistics).toBeCalledTimes(1);
    expect(spyGetActivitiesStatistics).toBeCalledWith(ACTIVITY_STATISTICS_GAP);
  });

  it('sets activity statistics', async () => {
    expect(wrapper.findComponent<typeof ActivityStatistics>(activityStatistics).vm.$props.statistics).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.activity
    );
  });

  it('sets exercise statistics', async () => {
    expect(wrapper.findComponent<typeof ExerciseStatistics>(exerciseStatistics).vm.$props.statistics).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.exercise
    );
  });

  it('hides hero section to auth users', async () => {
    expect(wrapper.find(hero).exists()).toBe(true);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(hero).exists()).toBe(false);
  });
});
