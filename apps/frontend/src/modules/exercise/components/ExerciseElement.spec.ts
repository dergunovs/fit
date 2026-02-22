import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';
import { IExercise } from 'fitness-tracker-contracts';

import ExerciseElement from './ExerciseElement.vue';
import ExerciseRepeats from '@/exercise/components/ExerciseRepeats.vue';
import ExerciseWeight from '@/exercise/components/ExerciseWeight.vue';
import ExerciseButtons from '@/exercise/components/ExerciseButtons.vue';
import ExerciseMuscleColors from '@/exercise/components/ExerciseMuscleColors.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_CHOOSEN_FIXTURE } from '@/exercise/fixtures';
import { getAvailableExerciseWeights } from '@/exercise/helpers';
import { USER_FIXTURE } from '@/user/fixtures';
import { spyUseAuthCheck } from '@/auth/mocks';

const muscleColors = dataTest('exercise-muscle-colors');
const title = dataTest('exercise-element-title');
const buttons = dataTest('exercise-buttons');
const repeats = dataTest('exercise-repeats');
const weight = dataTest('exercise-weight');

const INDEX = 1;
const IS_SET_CREATABLE = true;
const IS_LAST = false;
const IS_EDIT = true;
const IS_HIDE_TITLE = false;
const IS_DONE = false;
const IS_TO_FAILURE = false;
const DURATION = 0;
const IS_FUTURE_ACTIVITY = false;
const EXERCISES_COUNT = 3;

let wrapper: VueWrapper<InstanceType<typeof ExerciseElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseElement, {
    exercise: EXERCISE_CHOOSEN_FIXTURE,
    index: INDEX,
    isSetCreatable: IS_SET_CREATABLE,
    isLast: IS_LAST,
    isEdit: IS_EDIT,
    isHideTitle: IS_HIDE_TITLE,
    isDone: IS_DONE,
    isToFailure: IS_TO_FAILURE,
    duration: DURATION,
    isFutureActivity: IS_FUTURE_ACTIVITY,
    exercisesCount: EXERCISES_COUNT,
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseElement)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('passes props to muscle colors', async () => {
    expect(wrapper.findComponent<typeof ExerciseMuscleColors>(muscleColors).props('muscles')).toStrictEqual(
      EXERCISE_CHOOSEN_FIXTURE.exercise?.muscles
    );
  });

  it('hides muscle colors by props', async () => {
    await wrapper.setProps({ isHideTitle: true });

    expect(wrapper.find(muscleColors).exists()).toBe(false);
  });

  it('shows and hides title', async () => {
    expect(wrapper.find(title).exists()).toBe(true);

    await wrapper.setProps({ isHideTitle: true });

    expect(wrapper.find(title).exists()).toBe(false);
  });

  it('passes props to buttons', async () => {
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('repeats')).toBe(
      EXERCISE_CHOOSEN_FIXTURE.repeats
    );
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('weight')).toBe(
      EXERCISE_CHOOSEN_FIXTURE.weight
    );
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isWeights')).toBe(
      EXERCISE_CHOOSEN_FIXTURE.exercise?.isWeights
    );

    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('index')).toBe(INDEX);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isLast')).toBe(IS_LAST);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isSetCreatable')).toBe(IS_SET_CREATABLE);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isLast')).toBe(IS_LAST);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isEdit')).toBe(IS_EDIT);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isDone')).toBe(IS_DONE);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isToFailure')).toBe(IS_TO_FAILURE);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('duration')).toBe(DURATION);
    expect(wrapper.findComponent<typeof ExerciseButtons>(buttons).props('isFutureActivity')).toBe(IS_FUTURE_ACTIVITY);
  });

  it('emits events from buttons', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('createSet');
    expect(wrapper.emitted()).not.toHaveProperty('delete');
    expect(wrapper.emitted()).not.toHaveProperty('setIndex');

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('createSet');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('delete', EXERCISE_CHOOSEN_FIXTURE._id);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([EXERCISE_CHOOSEN_FIXTURE._id]);

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('setIndex', INDEX + 1);

    expect(wrapper.emitted('setIndex')).toHaveLength(1);
    expect(wrapper.emitted()['setIndex'][0]).toStrictEqual([INDEX + 1]);

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('setIsToFailure', !IS_TO_FAILURE);

    expect(wrapper.emitted('setIsToFailure')).toHaveLength(1);
    expect(wrapper.emitted()['setIsToFailure'][0]).toStrictEqual([!IS_TO_FAILURE]);
  });

  it('updates repeats', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('setRepeats');

    expect(wrapper.find(repeats).isVisible()).toBe(false);

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('editRepeats');

    await nextTick();

    expect(wrapper.find(repeats).isVisible()).toBe(true);

    expect(wrapper.findComponent<typeof ExerciseRepeats>(repeats).props('modelValue')).toStrictEqual(
      EXERCISE_CHOOSEN_FIXTURE.repeats
    );
    expect(wrapper.findComponent<typeof ExerciseRepeats>(repeats).props('baseRepeat')).toStrictEqual(
      EXERCISE_CHOOSEN_FIXTURE.repeats
    );

    const newRepeats = 2;

    wrapper.findComponent<typeof ExerciseRepeats>(repeats).vm.$emit('update:modelValue', newRepeats);

    await nextTick();

    expect(wrapper.emitted('setRepeats')).toHaveLength(1);
    expect(wrapper.emitted()['setRepeats'][0]).toStrictEqual([newRepeats]);

    expect(wrapper.find(repeats).isVisible()).toBe(false);
  });

  it('updates weight', async () => {
    expect(spyUseAuthCheck).toHaveBeenCalledTimes(1);

    expect(wrapper.emitted()).not.toHaveProperty('setWeight');

    expect(wrapper.find(weight).isVisible()).toBe(false);

    wrapper.findComponent<typeof ExerciseButtons>(buttons).vm.$emit('editWeight');

    await nextTick();

    expect(wrapper.find(weight).isVisible()).toBe(true);

    expect(wrapper.findComponent<typeof ExerciseWeight>(weight).props('modelValue')).toStrictEqual(
      EXERCISE_CHOOSEN_FIXTURE.weight
    );
    expect(wrapper.findComponent<typeof ExerciseWeight>(weight).props('options')).toStrictEqual(
      getAvailableExerciseWeights(EXERCISE_CHOOSEN_FIXTURE.exercise as IExercise, USER_FIXTURE)
    );

    const newWeight = 20;

    wrapper.findComponent<typeof ExerciseWeight>(weight).vm.$emit('update:modelValue', newWeight);

    await nextTick();

    expect(wrapper.emitted('setWeight')).toHaveLength(1);
    expect(wrapper.emitted()['setWeight'][0]).toStrictEqual([newWeight]);

    expect(wrapper.find(weight).isVisible()).toBe(false);
  });

  it('hides buttons when no exercise id', async () => {
    expect(wrapper.find(buttons).exists()).toBe(true);

    await wrapper.setProps({ exercise: { _id: undefined, repeats: 0 } });

    expect(wrapper.find(buttons).exists()).toBe(false);
  });
});
