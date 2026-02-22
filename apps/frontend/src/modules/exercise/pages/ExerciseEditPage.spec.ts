import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseEditPage from './ExerciseEditPage.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetExercise } from '@/exercise/mocks';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';
import { spyUseRouteId, mockRouteId } from '@/common/mocks';

const exerciseForm = dataTest('exercise-form');

let wrapper: VueWrapper<InstanceType<typeof ExerciseEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseEditPage);
});

enableAutoUnmount(afterEach);

describe('ExerciseEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseEditPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets exercise to form', async () => {
    expect(spyUseRouteId).toHaveBeenCalledTimes(1);
    expect(spyUseRouteId).toHaveBeenCalledWith('exercise');

    expect(spyGetExercise).toHaveBeenCalledTimes(1);
    expect(spyGetExercise).toHaveBeenCalledWith({ enabled: true }, mockRouteId);

    expect(wrapper.findComponent<typeof ExerciseForm>(exerciseForm).props('exercise')).toStrictEqual(EXERCISE_FIXTURE);
  });
});
