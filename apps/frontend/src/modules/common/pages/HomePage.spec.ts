import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, setAuth, wait } from 'mhz-helpers';

import HomePage from './HomePage.vue';
import PromoBlocks from '@/common/components/PromoBlocks.vue';
import ActivityCalendar from '@/activity/components/ActivityCalendar.vue';
import ActivityStatistics from '@/activity/components/ActivityStatistics.vue';
import ExerciseStatistics from '@/exercise/components/ExerciseStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_STATISTICS_FIXTURE, ACTIVITIES_CALENDAR_FIXTURE } from '@/activity/fixtures';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { spyGetActivitiesCalendar, spyGetActivitiesStatistics } from '@/activity/mocks';
import { convertActivityCalendarEvents } from '@/activity/helpers';
import {
  spyUseRouteId,
  mockRouteId,
  spyToastSuccess,
  spyRouterPush,
  spyUseCalendar,
  mockDateFrom,
  mockDateTo,
  mockIsDatesReady,
  spyUpdateDates,
} from '@/common/mocks';
import { mockOnSuccess, spyConfirmToken } from '@/auth/mocks';
import { URL_HOME } from '@/common/constants';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { spyGetMuscles } from '@/muscle/mocks';

const promoBlocks = dataTest('home-page-promo-blocks');
const calendar = dataTest('home-page-activity-calendar');
const activityStatistics = dataTest('home-page-activity-statistics');
const exerciseStatistics = dataTest('home-page-exercise-statistics');

let wrapper: VueWrapper<InstanceType<typeof HomePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(HomePage);
});

enableAutoUnmount(afterEach);

describe('HomePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(HomePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('confirms registration', async () => {
    expect(spyConfirmToken).toBeCalledTimes(0);

    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('token', true);

    await wait(2000);

    expect(spyConfirmToken).toBeCalledTimes(3);
    expect(spyConfirmToken).toBeCalledWith({ token: mockRouteId.value });

    await mockOnSuccess.confirmToken?.();

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });

  it('gets muscle data', async () => {
    expect(spyGetMuscles).toBeCalledTimes(1);
  });

  it('gets and formats activity calendar data', async () => {
    expect(spyUseCalendar).toBeCalledTimes(1);

    expect(spyGetActivitiesCalendar).toBeCalledTimes(1);
    expect(spyGetActivitiesCalendar).toBeCalledWith({ enabled: mockIsDatesReady }, mockDateFrom, mockDateTo);

    expect(wrapper.findComponent<typeof ActivityCalendar>(calendar).props('events')).toStrictEqual(
      convertActivityCalendarEvents(MUSCLES_FIXTURE, ACTIVITIES_CALENDAR_FIXTURE)
    );
  });

  it('updates dates on update activity calendar events', async () => {
    expect(spyUpdateDates).toBeCalledTimes(0);

    wrapper.findComponent<typeof ActivityCalendar>(calendar).vm.$emit('update');

    expect(spyUpdateDates).toBeCalledTimes(1);
  });

  it('gets activity statistics', async () => {
    expect(spyGetActivitiesStatistics).toBeCalledTimes(1);
    expect(spyGetActivitiesStatistics).toBeCalledWith(ACTIVITY_STATISTICS_GAP);
  });

  it('sets activity statistics', async () => {
    expect(wrapper.findComponent<typeof ActivityStatistics>(activityStatistics).props('statistics')).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.activity
    );
  });

  it('sets exercise statistics', async () => {
    expect(wrapper.findComponent<typeof ExerciseStatistics>(exerciseStatistics).props('statistics')).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.exercise
    );
  });

  it('emites register by promo blocks event', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('register');

    wrapper.findComponent<typeof PromoBlocks>(promoBlocks).vm.$emit('register');

    expect(wrapper.emitted('register')).toHaveLength(1);
    expect(wrapper.emitted()['register'][0]).toStrictEqual([]);
  });

  it('hides promo blocks to auth users', async () => {
    expect(wrapper.find(promoBlocks).exists()).toBe(true);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(promoBlocks).exists()).toBe(false);
  });
});
