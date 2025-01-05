import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseListPage from './ExerciseListPage.vue';
import ExerciseList from '@/exercise/components/ExerciseList.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetExercises } from '@/exercise/mocks';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { URL_EXERCISE_CREATE } from '@/exercise/constants';

const exerciseList = dataTest('exercise-list');
const addExercise = dataTest('add-exercise');

let wrapper: VueWrapper<InstanceType<typeof ExerciseListPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseListPage);
});

enableAutoUnmount(afterEach);

describe('ExerciseListPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseListPage)).toBeTruthy();
  });

  it('sets create exercise link', async () => {
    expect(wrapper.find(addExercise).attributes('to')).toBe(URL_EXERCISE_CREATE);
  });

  it('gets and sets exercises to list', async () => {
    expect(spyGetExercises).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof ExerciseList>(exerciseList).vm.$props.exercises).toStrictEqual(
      EXERCISES_FIXTURE
    );
  });
});
