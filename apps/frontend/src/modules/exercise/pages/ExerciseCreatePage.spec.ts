import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseCreatePage from './ExerciseCreatePage.vue';

import { wrapperFactory } from '@/common/test';

const exerciseForm = dataTest('exercise-form');

let wrapper: VueWrapper<InstanceType<typeof ExerciseCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseCreatePage);
});

enableAutoUnmount(afterEach);

describe('ExerciseCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseCreatePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercise form', async () => {
    expect(wrapper.find(exerciseForm).exists()).toBe(true);
  });
});
