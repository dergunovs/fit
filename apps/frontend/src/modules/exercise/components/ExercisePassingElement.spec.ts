import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExercisePassingElement from './ExercisePassingElement.vue';
import ExerciseDuration from './ExerciseDuration.vue';

import { dataTest, wait, wrapperFactory } from '@/common/test';
import { EXERCISE_DONE_FIXTURE, EXERCISE_NOT_DONE_FIXTURE } from '@/exercise/fixtures';
import { getExercisePassingTitle } from '@/exercise/helpers';

const exercise = dataTest('exercise-element');
const title = dataTest('exercise-title');
const button = dataTest('exercise-button');
const toFailure = dataTest('exercise-to-failure');
const repeats = dataTest('exercise-repeats');
const duration = dataTest('exercise-duration');

let wrapper: VueWrapper<InstanceType<typeof ExercisePassingElement>>;

const exerciseNotDone = EXERCISE_NOT_DONE_FIXTURE;
const activeExerciseId = '9999';
const isCurrentExercise = false;
const index = 1;
const exercisesCount = 3;

beforeEach(() => {
  wrapper = wrapperFactory(ExercisePassingElement, {
    exercise: exerciseNotDone,
    activeExerciseId,
    isCurrentExercise,
    index,
    exercisesCount,
  });
});

enableAutoUnmount(afterEach);

describe('ExercisePassingElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExercisePassingElement)).toBeTruthy();
  });

  it('shows element only if its not done', async () => {
    expect(wrapper.find(exercise).exists()).toBe(true);

    await wrapper.setProps({ exercise: EXERCISE_DONE_FIXTURE });

    expect(wrapper.find(exercise).exists()).toBe(false);
  });

  it('sets current and active statuses', async () => {
    expect(wrapper.find(exercise).attributes('data-current')).toBe(isCurrentExercise.toString());

    expect(wrapper.find(exercise).attributes('data-active')).toBe(
      (exerciseNotDone._id === activeExerciseId).toString()
    );
  });

  it('shows exercise title', async () => {
    expect(wrapper.find(title).attributes('data-current')).toBe(isCurrentExercise.toString());

    expect(wrapper.find(title).text()).toBe(
      getExercisePassingTitle(index, isCurrentExercise, exercisesCount, exerciseNotDone)
    );
  });

  it('shows exercise controls if its current', async () => {
    expect(wrapper.find(button).exists()).toBe(false);
    expect(wrapper.find(toFailure).exists()).toBe(false);
    expect(wrapper.find(repeats).exists()).toBe(false);
    expect(wrapper.find(duration).exists()).toBe(false);

    await wrapper.setProps({ isCurrentExercise: true });

    expect(wrapper.find(button).exists()).toBe(true);
    expect(wrapper.find(toFailure).exists()).toBe(true);
    expect(wrapper.find(repeats).exists()).toBe(true);
    expect(wrapper.find(duration).exists()).toBe(true);
  });

  it('disables button at start and end to reduce missclick chance', async () => {
    await wrapper.setProps({ isCurrentExercise: true });

    expect(wrapper.find(button).attributes('isdisabled')).toBe('true');

    await wait(501);

    expect(wrapper.find(button).attributes('isdisabled')).toBe('false');

    await wrapper.find(button).trigger('click');

    expect(wrapper.find(button).attributes('isdisabled')).toBe('true');
  });

  it('starts exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('start');

    await wrapper.setProps({ isCurrentExercise: true });

    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.start).toStrictEqual(false);
    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.stop).toStrictEqual(false);

    await wrapper.find(button).trigger('click');

    expect(wrapper.emitted('start')).toHaveLength(1);
    expect(wrapper.emitted()['start'][0]).toStrictEqual([exerciseNotDone._id]);

    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.start).toStrictEqual(true);
    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.stop).toStrictEqual(false);
  });

  it('emits exercise data when stopped', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('stop');

    await wrapper.setProps({ isCurrentExercise: true, activeExerciseId: exerciseNotDone._id });

    await wrapper.find(button).trigger('click');

    await wait(501);

    await wrapper.find(button).trigger('click');

    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.start).toStrictEqual(false);
    expect(wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$props.stop).toStrictEqual(true);

    const durationTime = 12;

    wrapper.findComponent<typeof ExerciseDuration>(duration).vm.$emit('stop', durationTime);

    expect(wrapper.emitted('stop')).toHaveLength(1);
    expect(wrapper.emitted()['stop'][0]).toStrictEqual([
      {
        _id: exerciseNotDone._id,
        duration: durationTime,
        isToFailure: false,
        repeats: exerciseNotDone.repeats,
      },
    ]);
  });

  it('handles exercise to failure checkbox', async () => {
    await wrapper.setProps({ isCurrentExercise: true });

    expect(wrapper.find(toFailure).attributes('isdisabled')).toBe('true');

    await wrapper.setProps({ activeExerciseId: exerciseNotDone._id });

    expect(wrapper.find(toFailure).attributes('isdisabled')).toBe('false');
    expect(wrapper.find(toFailure).attributes('modelvalue')).toBe('false');
  });

  it('handles repeats choice', async () => {
    await wrapper.setProps({ isCurrentExercise: true, activeExerciseId: exerciseNotDone._id });

    expect(wrapper.find(repeats).attributes('options')).toBe(
      [
        exerciseNotDone.repeats - 2,
        exerciseNotDone.repeats - 1,
        exerciseNotDone.repeats,
        exerciseNotDone.repeats + 1,
        exerciseNotDone.repeats + 2,
      ].join()
    );
    expect(wrapper.find(repeats).attributes('modelvalue')).toBe(exerciseNotDone.repeats.toString());
  });
});
