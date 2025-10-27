import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof App>>;

beforeEach(() => {
  wrapper = wrapperFactory(App);
});

enableAutoUnmount(afterEach);

describe('App', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(App)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
