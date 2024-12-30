import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ActivityCreatePage from './ActivityCreatePage.vue';
import ActivityForm from './ActivityForm.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { spyGetActivitiesStatistics } from '@/activity/mocks';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';

const activityForm = dataTest('activity-form');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityCreatePage, {});
});

enableAutoUnmount(afterEach);

describe('ActivityCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityCreatePage)).toBeTruthy();
  });

  it('shows activity form', async () => {
    expect(wrapper.find(activityForm).exists()).toBe(true);
  });

  it('gets activity statistics and sets props to form', async () => {
    expect(spyGetActivitiesStatistics).toBeCalledTimes(1);
    expect(spyGetActivitiesStatistics).toBeCalledWith(ACTIVITY_STATISTICS_GAP);

    expect(wrapper.findComponent<typeof ActivityForm>(activityForm).vm.$props.exerciseStatistics).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.exercise
    );

    expect(wrapper.findComponent<typeof ActivityForm>(activityForm).vm.$props.averageRestPercent).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.activity.averageRestPercent.cur
    );
  });
});
