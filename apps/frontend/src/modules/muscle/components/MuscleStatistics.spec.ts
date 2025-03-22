import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import MuscleStatistics from './MuscleStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { generateMuscleStatistics } from '@/muscle/helpers';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

const tableRow = dataTest('muscle-row');
const title = dataTest('muscle-title');
const sets = dataTest('muscle-sets');
const repeats = dataTest('muscle-repeats');

let wrapper: VueWrapper<InstanceType<typeof MuscleStatistics>>;

const statistics = generateMuscleStatistics(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE);

beforeEach(() => {
  wrapper = wrapperFactory(MuscleStatistics, { statistics });
});

enableAutoUnmount(afterEach);

describe('MuscleStatistics', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleStatistics)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercises in table', async () => {
    expect(wrapper.findAll(tableRow).length).toBe(statistics.length);

    expect(wrapper.find(title).text()).toBe(statistics[0].title);
    expect(wrapper.find(sets).text()).toBe(statistics[0].sets.toString());
    expect(wrapper.find(repeats).text()).toBe(statistics[0].repeats.toString());
  });
});
