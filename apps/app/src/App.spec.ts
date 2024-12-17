import { ref, computed } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';
import LayoutDefault from '@/common/components/LayoutDefault.vue';
import { wrapperFactory } from '@/common/test';

import * as authComposables from '@/auth/composables';
import * as commonComposables from '@/common/composables';

const isLoaded = ref(false);

const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockImplementation(() => vi.fn());

const spyUseLayout = vi.spyOn(commonComposables, 'useLayout').mockImplementation(() => {
  return { isLoaded, layoutComponent: computed(() => LayoutDefault) };
});

const layout = '[data-test="layout"]';

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(App, {});
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

    await new Promise((r) => {
      setTimeout(r, 10);
    });

    expect(wrapper.find(layout).exists()).toBe(true);
  });

  it('checks auth', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });
});
