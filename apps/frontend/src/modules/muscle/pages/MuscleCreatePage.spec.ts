import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import MuscleCreatePage from './MuscleCreatePage.vue';

import { wrapperFactory } from '@/common/test';

const muscleForm = dataTest('muscle-form');

let wrapper: VueWrapper<InstanceType<typeof MuscleCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(MuscleCreatePage);
});

enableAutoUnmount(afterEach);

describe('MuscleCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleCreatePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows muscle form', async () => {
    expect(wrapper.find(muscleForm).exists()).toBe(true);
  });
});
