import { ref } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import HomePage from './HomePage.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { wrapperFactory, dataTest } from '@/common/test';
import { ACTIVITIES_CALENDAR_FIXTURE, ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import {
  spyUseActivityCalendar,
  spyGetActivitiesCalendar,
  spyComputedActivityCalendarEvents,
  dateFrom,
  dateTo,
  isDatesReady,
  spyUpdateDates,
  computedActivityCalendarEvents,
  spyGetActivitiesStatistics,
} from '@/activity/mocks';

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
    expect(spyGetActivitiesCalendar).toBeCalledWith({ enabled: isDatesReady }, dateFrom, dateTo);

    expect(spyComputedActivityCalendarEvents).toBeCalledTimes(1);
    expect(spyComputedActivityCalendarEvents).toBeCalledWith(ref(ACTIVITIES_CALENDAR_FIXTURE));

    expect(wrapper.findComponent<typeof ActivityCalendar>(activityCalendar).vm.$props.events).toStrictEqual(
      computedActivityCalendarEvents.value
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
});
