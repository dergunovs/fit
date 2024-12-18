import { ref, computed } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';
import LayoutDefault from '@/common/components/LayoutDefault.vue';
import { dataTest, wait, wrapperFactory } from '@/common/test';

import * as authComposables from '@/auth/composables';
import * as commonComposables from '@/common/composables';

const isLoaded = ref(false);
const layoutComponent = computed(() => LayoutDefault);

const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockImplementation(() => vi.fn());

const spyUseLayout = vi.spyOn(commonComposables, 'useLayout').mockImplementation(() => {
  return { isLoaded, layoutComponent };
});

const layout = dataTest('layout');

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

    await wait();

    expect(wrapper.find(layout).exists()).toBe(true);
    expect(wrapper.find(layout).attributes('data-layout')).toBe(LayoutDefault.name);
  });

  it('checks auth', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });
});
