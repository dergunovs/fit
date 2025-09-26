import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import ExerciseElementPassing from './ExerciseElementPassing.vue';
import ExerciseDurationTimer from './ExerciseDurationTimer.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_NOT_DONE_FIXTURE } from '@/exercise/fixtures';

const exercise = dataTest('exercise-passing-element');
const button = dataTest('exercise-passing-button');
const toFailure = dataTest('exercise-passing-to-failure');
const duration = dataTest('exercise-passing-duration');

let wrapper: VueWrapper<InstanceType<typeof ExerciseElementPassing>>;

const isActive = false;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseElementPassing, { exercise: EXERCISE_NOT_DONE_FIXTURE, isActive });
});

enableAutoUnmount(afterEach);

describe('ExerciseElementPassing', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseElementPassing)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets active data', async () => {
    expect(wrapper.find(exercise).attributes('data-active')).toBe(isActive.toString());
  });

  it('disables button at start and end to reduce missclick chance', async () => {
    expect(wrapper.find(button).attributes('isdisabled')).toBe('false');

    await wrapper.find(button).trigger('click');

    expect(wrapper.find(button).attributes('isdisabled')).toBe('true');

    await wait(501);

    expect(wrapper.find(button).attributes('isdisabled')).toBe('false');
  });

  it('starts exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('start');

    await wrapper.find(button).trigger('click');

    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('start')).toStrictEqual(true);
    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('stop')).toStrictEqual(false);

    expect(wrapper.emitted('start')).toHaveLength(1);
    expect(wrapper.emitted()['start'][0]).toStrictEqual([EXERCISE_NOT_DONE_FIXTURE._id]);
  });

  it('emits exercise data when stopped', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('stop');

    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('start')).toStrictEqual(false);
    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('stop')).toStrictEqual(false);

    await wrapper.find(button).trigger('click');

    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('start')).toStrictEqual(true);
    expect(wrapper.findComponent<typeof ExerciseDurationTimer>(duration).props('stop')).toStrictEqual(false);

    await wait(501);

    await wrapper.find(button).trigger('click');

    const durationTime = 44;
    const isToFailure = false;

    wrapper.findComponent<typeof ExerciseDurationTimer>(duration).vm.$emit('stop', durationTime);

    expect(wrapper.emitted('stop')).toHaveLength(1);
    expect(wrapper.emitted()['stop'][0]).toStrictEqual([
      EXERCISE_NOT_DONE_FIXTURE,
      durationTime,
      isToFailure,
      undefined,
    ]);
  });

  it('handles exercise to failure checkbox', async () => {
    expect(wrapper.find(toFailure).attributes('isdisabled')).toBe('true');

    await wrapper.setProps({ isActive: true });

    expect(wrapper.find(toFailure).attributes('isdisabled')).toBe('false');
    expect(wrapper.find(toFailure).attributes('modelvalue')).toBe('false');
  });
});
