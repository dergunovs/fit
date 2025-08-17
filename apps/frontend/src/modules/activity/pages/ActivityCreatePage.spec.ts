import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityCreatePage from './ActivityCreatePage.vue';
import ActivityForm from '@/activity/components/ActivityForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetActivitiesStatistics } from '@/activity/mocks';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';
import { ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';

const activityForm = dataTest('activity-form');

let wrapper: VueWrapper<InstanceType<typeof ActivityCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityCreatePage);
});

enableAutoUnmount(afterEach);

describe('ActivityCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityCreatePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows activity form', async () => {
    expect(wrapper.find(activityForm).exists()).toBe(true);
  });

  it('gets activity statistics and sets props to form', async () => {
    expect(spyGetActivitiesStatistics).toBeCalledTimes(1);
    expect(spyGetActivitiesStatistics).toBeCalledWith(ACTIVITY_STATISTICS_GAP);

    expect(wrapper.findComponent<typeof ActivityForm>(activityForm).props('exerciseStatistics')).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.exercise
    );

    expect(wrapper.findComponent<typeof ActivityForm>(activityForm).props('averageRestPercent')).toStrictEqual(
      ACTIVITIES_STATISTICS_FIXTURE.activity.averageRestPercent.cur
    );
  });
});
