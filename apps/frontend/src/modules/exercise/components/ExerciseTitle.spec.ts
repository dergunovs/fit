import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDuration, dataTest } from 'mhz-helpers';

import ExerciseTitle from './ExerciseTitle.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_DONE_FIXTURE } from '@/exercise/fixtures';
import { EXERCISE_DELETED_TITLE } from '@/exercise/constants';

const title = dataTest('exercise-title');
const isNotDone = dataTest('exercise-is-not-done');
const repeats = dataTest('exercise-repeats');
const weight = dataTest('exercise-weight');
const duration = dataTest('exercise-duration');
const toFailure = dataTest('exercise-to-failure');

let wrapper: VueWrapper<InstanceType<typeof ExerciseTitle>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseTitle, { exercise: EXERCISE_DONE_FIXTURE, isHideTitle: false });
});

enableAutoUnmount(afterEach);

describe('ExerciseTitle', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseTitle)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(title).text()).toBe(EXERCISE_DONE_FIXTURE.exercise?.title);

    await wrapper.setProps({ exercise: { ...EXERCISE_DONE_FIXTURE, exercise: undefined } });

    expect(wrapper.find(title).text()).toBe(EXERCISE_DELETED_TITLE);

    await wrapper.setProps({ exercise: EXERCISE_DONE_FIXTURE, isHideTitle: true });

    expect(wrapper.find(title).exists()).toBe(false);
  });

  it('shows if exercise is not done', async () => {
    expect(wrapper.find(isNotDone).exists()).toBe(false);

    await wrapper.setProps({ exercise: { ...EXERCISE_DONE_FIXTURE, isDone: false } });

    expect(wrapper.find(isNotDone).exists()).toBe(true);
  });

  it('shows exercise repeats', async () => {
    expect(wrapper.find(repeats).text()).toBe(`x${EXERCISE_DONE_FIXTURE.repeats}`);
  });

  it('shows exercise weight', async () => {
    expect(wrapper.find(weight).text()).toBe(`${EXERCISE_DONE_FIXTURE.weight} кг.`);
  });

  it('shows exercise duration', async () => {
    expect(wrapper.find(duration).text()).toBe(formatDuration(EXERCISE_DONE_FIXTURE.duration));

    await wrapper.setProps({ exercise: { ...EXERCISE_DONE_FIXTURE, duration: 0 } });

    expect(wrapper.find(duration).exists()).toBe(false);
  });

  it('shows if exercise is done to failure', async () => {
    expect(wrapper.find(toFailure).exists()).toBe(EXERCISE_DONE_FIXTURE.isToFailure);

    await wrapper.setProps({ exercise: { ...EXERCISE_DONE_FIXTURE, isToFailure: false } });

    expect(wrapper.find(toFailure).exists()).toBe(false);
  });
});
