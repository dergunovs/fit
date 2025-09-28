import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiModal } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseManagment from './ExerciseManagment.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_FIXTURE, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { spyGetExercisesAll } from '@/exercise/mocks';
import { addSetToExercises, updateExercisesIndex, updateExerciseField } from '@/exercise/helpers';

const ID = EXERCISES_CHOOSEN_FIXTURE[0]._id;

const modal = dataTest('exercise-modal');
const chooseList = dataTest('exercise-choose-list');
const exercises = dataTest('exercise-element-list');

let wrapper: VueWrapper<InstanceType<typeof ExerciseManagment>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseManagment, { isShowModal: false, modelValue: EXERCISES_CHOOSEN_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseManagment', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseManagment)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets exercises data', async () => {
    expect(spyGetExercisesAll).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof ExerciseChooseList>(chooseList).props('exercises')).toStrictEqual(
      EXERCISES_FIXTURE
    );
  });

  it('hides modal by default', async () => {
    expect(wrapper.find(modal).attributes('modelvalue')).toStrictEqual('false');
  });

  it('emits update modal', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('updateModal');

    wrapper.findComponent<typeof UiModal>(modal).vm.$emit('update:modelValue', true);

    expect(wrapper.emitted('updateModal')).toHaveLength(1);
    expect(wrapper.emitted()['updateModal'][0]).toStrictEqual([true]);
  });

  it('passes exercises to choosen list', async () => {
    expect(wrapper.findComponent<typeof ExerciseElementList>(exercises).props('exercises')).toStrictEqual(
      EXERCISES_CHOOSEN_FIXTURE
    );
  });

  it('adds exercises', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
    expect(wrapper.emitted()).not.toHaveProperty('updateModal');

    wrapper.findComponent<typeof ExerciseChooseList>(chooseList).vm.$emit('choose', [EXERCISE_CHOOSEN_FIXTURE]);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([
      [...EXERCISES_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_FIXTURE],
    ]);

    expect(wrapper.emitted('updateModal')).toHaveLength(1);
    expect(wrapper.emitted()['updateModal'][0]).toStrictEqual([false]);
  });

  it('deletes exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseElementList>(exercises).vm.$emit('delete', ID);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([[EXERCISES_CHOOSEN_FIXTURE[1]]]);
  });

  it('adds set', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseElementList>(exercises).vm.$emit('createSet');

    const updatedExercises = addSetToExercises(EXERCISES_CHOOSEN_FIXTURE);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('sets new exercise index', async () => {
    const INDEX = 2;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseElementList>(exercises).vm.$emit('setIndex', INDEX);

    const updatedExercises = updateExercisesIndex(EXERCISES_CHOOSEN_FIXTURE, INDEX);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('updates repeats', async () => {
    const REPEATS = 11;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseElementList>(exercises).vm.$emit('setRepeats', REPEATS, ID);

    const updatedExercises = updateExerciseField(EXERCISES_CHOOSEN_FIXTURE, 'repeats', REPEATS, ID as string);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('updates weight', async () => {
    const WEIGHT = 44;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseElementList>(exercises).vm.$emit('setWeight', WEIGHT, ID);

    const updatedExercises = updateExerciseField(EXERCISES_CHOOSEN_FIXTURE, 'weight', WEIGHT, ID as string);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });
});
