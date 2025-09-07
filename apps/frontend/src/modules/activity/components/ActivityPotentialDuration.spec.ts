import { describe, it, expect, beforeEach } from 'vitest';
import { VueWrapper } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityPotentialDuration from './ActivityPotentialDuration.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE } from '@/exercise/fixtures';
import { ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';
import { getPotentialActivityDuration } from '@/activity/helpers';
import { spyGetActivitiesStatistics } from '@/activity/mocks';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';

const activityPotentialDuration = dataTest('activity-potential-duration');

let wrapper: VueWrapper<InstanceType<typeof ActivityPotentialDuration>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityPotentialDuration, {
    exercises: EXERCISES_CHOOSEN_FIXTURE,
  });
});

describe('ActivityPotentialDuration', () => {
  it('exists', () => {
    expect(wrapper.findComponent(ActivityPotentialDuration)).toBeTruthy();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows potential duration when exercises and statistics are provided', async () => {
    expect(spyGetActivitiesStatistics).toBeCalledTimes(1);
    expect(spyGetActivitiesStatistics).toBeCalledWith(ACTIVITY_STATISTICS_GAP);

    expect(wrapper.find(activityPotentialDuration).exists()).toBe(true);

    const potentialDuration = getPotentialActivityDuration(
      EXERCISES_CHOOSEN_FIXTURE,
      'ru',
      ACTIVITIES_STATISTICS_FIXTURE.exercise,
      ACTIVITIES_STATISTICS_FIXTURE.activity.averageRestPercent.cur
    );

    expect(wrapper.find(activityPotentialDuration).text()).toBe(potentialDuration);
  });
});
