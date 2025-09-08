import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseManagment from './ExerciseManagment.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE } from '@/exercise/fixtures';
import { spyGetExercisesAll } from '@/exercise/mocks';

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
  });
});
