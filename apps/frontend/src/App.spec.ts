import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { spyUseLayout, isLoaded, layoutDefaultName } from '@/common/mocks';
import { spyUseAuthCheck } from '@/auth/mocks';

const layout = dataTest('app-layout');

let wrapper: VueWrapper<InstanceType<typeof App>>;

beforeEach(() => {
  wrapper = wrapperFactory(App);
});

enableAutoUnmount(afterEach);

describe('App', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(App)).toBeTruthy();
  });

  it('shows layout component', async () => {
    expect(wrapper.find(layout).exists()).toBe(false);

    expect(spyUseLayout).toBeCalledTimes(1);
    isLoaded.value = true;

    await nextTick();

    expect(wrapper.find(layout).exists()).toBe(true);
    expect(wrapper.find(layout).attributes('data-layout')).toBe(layoutDefaultName);
  });

  it('checks auth', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });
});
