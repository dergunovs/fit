import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseEditPage from './ExerciseEditPage.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { spyGetExercise } from '@/exercise/mocks';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';

const exerciseForm = dataTest('exercise-form');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseEditPage, {});
});

enableAutoUnmount(afterEach);

describe('ExerciseEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseEditPage)).toBeTruthy();
  });

  it('gets and sets exercise to form', async () => {
    expect(spyGetExercise).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof ExerciseForm>(exerciseForm).vm.$props.exercise).toStrictEqual(EXERCISE_FIXTURE);
  });
});
