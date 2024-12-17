import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';
import { wrapperFactory, router } from '@/common/test';

import * as authComposables from '@/auth/composables';

const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockImplementation(() => vi.fn());

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

    router.push('/');
    await router.isReady();

    await new Promise((r) => {
      setTimeout(r, 10);
    });

    expect(wrapper.find(layout).exists()).toBe(true);
  });

  it('checks auth', async () => {
    router.push('/');
    await router.isReady();

    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });
});
