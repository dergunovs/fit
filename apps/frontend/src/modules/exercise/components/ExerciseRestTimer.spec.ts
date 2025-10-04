import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import ExerciseRestTimer from './ExerciseRestTimer.vue';

import { wrapperFactory } from '@/common/test';

const rest = dataTest('exercise-rest');

let wrapper: VueWrapper<InstanceType<typeof ExerciseRestTimer>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseRestTimer, { start: true, stop: false });
});

enableAutoUnmount(afterEach);

describe('ExerciseRestTimer', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseRestTimer)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows rest timer', async () => {
    expect(wrapper.find(rest).text()).toBe('00:00');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:01');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:02');
  });

  it('does not start timer when start prop is false on mount', async () => {
    const wrapperStopped = wrapperFactory(ExerciseRestTimer, { start: false, stop: true });

    expect(wrapperStopped.find(rest).text()).toBe('00:00');

    await wait(1000);

    expect(wrapperStopped.find(rest).text()).toBe('00:00');
  });

  it('stops timer when stop prop changes to true', async () => {
    expect(wrapper.find(rest).text()).toBe('00:00');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:01');

    await wrapper.setProps({ stop: true });

    expect(wrapper.find(rest).text()).toBe('00:00');

    await wait(1000);

    expect(wrapper.find(rest).text()).toBe('00:00');
  });
});
