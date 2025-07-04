import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import ExerciseDurationTimer from './ExerciseDurationTimer.vue';

import { wrapperFactory } from '@/common/test';

const duration = dataTest('exercise-duration');

let wrapper: VueWrapper<InstanceType<typeof ExerciseDurationTimer>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseDurationTimer, { start: false, stop: false });
});

enableAutoUnmount(afterEach);

describe('ExerciseDurationTimer', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseDurationTimer)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows zero duration', async () => {
    expect(wrapper.find(duration).text()).toBe('00:00');
  });

  it('emits duration data and stops timer', async () => {
    await wrapper.setProps({ start: true });

    expect(wrapper.emitted()).not.toHaveProperty('stop');

    await wait(1000);

    expect(wrapper.find(duration).text()).toBe('00:01');

    await wait(1000);

    expect(wrapper.find(duration).text()).toBe('00:02');

    await wait(1000);

    await wrapper.setProps({ start: false, stop: true });

    expect(wrapper.emitted('stop')).toHaveLength(1);
    expect(wrapper.emitted()['stop'][0]).toStrictEqual([3]);

    await wait(1000);

    expect(wrapper.find(duration).text()).toBe('00:03');
  });
});
