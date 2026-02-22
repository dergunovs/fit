import { ref } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiPagination } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseListPage from './ExerciseListPage.vue';
import ExerciseList from '@/exercise/components/ExerciseList.vue';

import { wrapperFactory } from '@/common/test';
import { mockGetExercisesData, spyGetExercises } from '@/exercise/mocks';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { URL_EXERCISE_CREATE } from '@/exercise/constants';
import { mockPageNumber, spySetPage, spyUsePageNumber, spyUsePagination } from '@/common/mocks';

const exerciseList = dataTest('exercise-list');
const exerciseListPagination = dataTest('exercise-list-pagination');
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

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets create exercise link', async () => {
    expect(wrapper.find(addExercise).attributes('to')).toBe(URL_EXERCISE_CREATE);
  });

  it('gets and sets exercises to list', async () => {
    expect(spyUsePageNumber).toHaveBeenCalledTimes(1);

    expect(spyGetExercises).toHaveBeenCalledTimes(1);
    expect(spyGetExercises).toHaveBeenCalledWith(mockPageNumber);

    expect(spyUsePagination).toHaveBeenCalledTimes(1);
    expect(spyUsePagination).toHaveBeenCalledWith(ref(mockGetExercisesData));

    expect(wrapper.findComponent<typeof ExerciseList>(exerciseList).props('exercises')).toStrictEqual(
      EXERCISES_FIXTURE
    );
  });

  it('sets data to pagination', async () => {
    expect(wrapper.find(exerciseListPagination).attributes('page')).toBe(mockPageNumber.value.toString());
    expect(wrapper.find(exerciseListPagination).attributes('total')).toBe(EXERCISES_FIXTURE.length.toString());
  });

  it('updates pagination', async () => {
    wrapper.findComponent<typeof UiPagination>(exerciseListPagination).vm.$emit('update', 2);

    expect(spySetPage).toHaveBeenCalledTimes(1);
  });
});
