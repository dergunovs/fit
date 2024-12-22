import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseCreatePage from './ExerciseCreatePage.vue';

import { dataTest, wrapperFactory } from '@/common/test';

const exerciseForm = dataTest('exercise-form');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseCreatePage, {});
});

enableAutoUnmount(afterEach);

describe('ExerciseCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseCreatePage)).toBeTruthy();
  });

  it('shows exercise form', async () => {
    expect(wrapper.find(exerciseForm).exists()).toBe(true);
  });
});
