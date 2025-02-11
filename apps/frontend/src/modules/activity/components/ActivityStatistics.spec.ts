import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDuration, dataTest } from 'mhz-helpers';

import ActivityStatistics from './ActivityStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';

const totalDuration = dataTest('activity-statistics-total-duration');
const totalCount = dataTest('activity-statistics-total-count');
const totalSets = dataTest('activity-statistics-total-sets');
const totalRepeats = dataTest('activity-statistics-total-repeats');
const averageDuration = dataTest('activity-statistics-average-duration');
const averageSets = dataTest('activity-statistics-average-sets');
const averageRepeats = dataTest('activity-statistics-average-repeats');
const averageRest = dataTest('activity-statistics-average-rest');

const statistics = ACTIVITIES_STATISTICS_FIXTURE.activity;

let wrapper: VueWrapper<InstanceType<typeof ActivityStatistics>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityStatistics, { statistics });
});

enableAutoUnmount(afterEach);

describe('ActivityStatistics', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityStatistics)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows total statistics data', async () => {
    expect(wrapper.find(totalDuration).text()).toBe(formatDuration(statistics.duration.cur));
    expect(wrapper.find(totalCount).text()).toBe(statistics.activitiesCount.cur.toString());
    expect(wrapper.find(totalSets).text()).toBe(statistics.setsCount.cur.toString());
    expect(wrapper.find(totalRepeats).text()).toBe(statistics.repeatsCount.cur.toString());
  });

  it('shows average statistics data', async () => {
    expect(wrapper.find(averageDuration).text()).toBe(formatDuration(statistics.averageDuration.cur));
    expect(wrapper.find(averageSets).text()).toBe(statistics.averageSetsPerActivity.cur.toString());
    expect(wrapper.find(averageRepeats).text()).toBe(statistics.averageRepeatsPerSet.cur.toString());
    expect(wrapper.find(averageRest).text()).toBe(`${statistics.averageRestPercent.cur.toString()}%`);
  });
});
