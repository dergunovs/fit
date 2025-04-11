import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, setAuth } from 'mhz-helpers';

import ExerciseStatistics from './ExerciseStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_STATISTICS_FIXTURE } from '@/exercise/fixtures';
import { getAverageDuration } from '@/exercise/helpers';

const tableRow = dataTest('exercise-statistics-table-row');
const title = dataTest('exercise-statistics-title');
const setsCount = dataTest('exercise-statistics-sets-count');
const repeatsCount = dataTest('exercise-statistics-repeats-count');
const setsDuration = dataTest('exercise-statistics-sets-duration');
const repeatsDuration = dataTest('exercise-statistics-repeats-duration');
const modal = dataTest('exercise-statistics-modal');
const info = dataTest('exercise-statistics-info');

let wrapper: VueWrapper<InstanceType<typeof ExerciseStatistics>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseStatistics, { statistics: EXERCISES_STATISTICS_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseStatistics', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseStatistics)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows statistics rows', async () => {
    expect(wrapper.findAll(tableRow).length).toBe(EXERCISES_STATISTICS_FIXTURE.length);
  });

  it('shows statistics title', async () => {
    expect(wrapper.find(title).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].exercise.title);
  });

  it('shows sets and repeats count', async () => {
    expect(wrapper.find(setsCount).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].sets.toString());
    expect(wrapper.find(repeatsCount).text()).toBe(EXERCISES_STATISTICS_FIXTURE[0].repeats.toString());
  });

  it('shows sets and repeats average duration', async () => {
    expect(wrapper.find(setsDuration).text()).toBe(`${getAverageDuration(EXERCISES_STATISTICS_FIXTURE[0], 'set')}с`);

    expect(wrapper.find(repeatsDuration).text()).toBe(
      `${getAverageDuration(EXERCISES_STATISTICS_FIXTURE[0], 'repeat')}с`
    );
  });

  it('shows info modal by button click', async () => {
    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');
    expect(wrapper.find(info).exists()).toBe(false);

    await wrapper.find(title).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('true');
    expect(wrapper.find(info).exists()).toBe(true);
  });

  it('shows equipment matches', async () => {
    expect(wrapper.find(title).attributes('data-equipment')).toBe('true');

    setAuth(true);

    await nextTick();

    expect(wrapper.find(title).attributes('data-equipment')).toBe(
      EXERCISES_STATISTICS_FIXTURE[0].isUserEquipmentMatches.toString()
    );
  });
});
