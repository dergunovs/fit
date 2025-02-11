import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import StatisticsExample from './StatisticsExample.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof StatisticsExample>>;

beforeEach(() => {
  wrapper = wrapperFactory(StatisticsExample);
});

enableAutoUnmount(afterEach);

describe('StatisticsExample', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(StatisticsExample)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
