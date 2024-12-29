import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseStatistics from './ExerciseStatistics.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISES_STATISTICS_FIXTURE } from '@/exercise/fixtures';
import { getAverageDuration } from '@/exercise/helpers';

const tableRow = dataTest('exercise-statistics-table-row');
const title = dataTest('exercise-statistics-title');
const setsCount = dataTest('exercise-statistics-sets-count');
const repeatsCount = dataTest('exercise-statistics-repeats-count');
const setsDuration = dataTest('exercise-statistics-sets-duration');
const repeatsDuration = dataTest('exercise-statistics-repeats-duration');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseStatistics, {
    props: {
      statistics: EXERCISES_STATISTICS_FIXTURE,
    },
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseStatistics', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseStatistics)).toBeTruthy();
  });

  it('shows statistics rows', async () => {
    expect(wrapper.findAll(tableRow).length).toBe(EXERCISES_STATISTICS_FIXTURE.length);
  });

  it('shows statistics title', async () => {
    expect(wrapper.find(title).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].title);
  });

  it('shows sets and repeats count', async () => {
    expect(wrapper.find(setsCount).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].sets.toString());
    expect(wrapper.find(repeatsCount).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].repeats.toString());
  });

  it('shows sets and repeats average duration', async () => {
    expect(wrapper.find(setsDuration).text()).toBe(getAverageDuration(EXERCISES_STATISTICS_FIXTURE[0], 'set'));
    expect(wrapper.find(repeatsDuration).text()).toBe(getAverageDuration(EXERCISES_STATISTICS_FIXTURE[0], 'repeat'));
  });
});
