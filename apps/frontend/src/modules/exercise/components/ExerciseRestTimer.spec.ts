import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import ExerciseRestTimer from './ExerciseRestTimer.vue';

import { wrapperFactory } from '@/common/test';

const rest = dataTest('exercise-rest');

let wrapper: VueWrapper<InstanceType<typeof ExerciseRestTimer>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseRestTimer);
});

enableAutoUnmount(afterEach);

describe('ExerciseRestTimer', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseRestTimer)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows rest', async () => {
    expect(wrapper.find(rest).text()).toBe('00:00');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:01');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:02');
  });
});
