import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiModal } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseManagment from './ExerciseManagment.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_FIXTURE, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { spyGetExercisesAll } from '@/exercise/mocks';
import {
  addSetToExercises,
  updateExercisesIndex,
  updateExercisesRepeats,
  updateExercisesWeight,
} from '@/exercise/helpers';

const ID = EXERCISES_CHOOSEN_FIXTURE[0]._id;

const modal = dataTest('exercise-modal');
const chooseList = dataTest('exercise-choose-list');
const choosenList = dataTest('exercise-choosen-list');

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
    expect(wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).props('choosenExercises')).toStrictEqual(
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

    wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).vm.$emit('delete', ID);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([[EXERCISES_CHOOSEN_FIXTURE[1]]]);
  });

  it('adds set', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).vm.$emit('createSet');

    const updatedExercises = addSetToExercises(EXERCISES_CHOOSEN_FIXTURE);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('sets new exercise index', async () => {
    const INDEX = 2;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).vm.$emit('setIndex', INDEX);

    const updatedExercises = updateExercisesIndex(EXERCISES_CHOOSEN_FIXTURE, INDEX);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('updates repeats', async () => {
    const REPEATS = 11;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).vm.$emit('setRepeats', REPEATS, ID);

    const updatedExercises = updateExercisesRepeats(EXERCISES_CHOOSEN_FIXTURE, REPEATS, ID as string);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });

  it('updates weight', async () => {
    const WEIGHT = 44;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof ExerciseChoosenList>(choosenList).vm.$emit('setWeight', WEIGHT, ID);

    const updatedExercises = updateExercisesWeight(EXERCISES_CHOOSEN_FIXTURE, WEIGHT, ID as string);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedExercises]);
  });
});
