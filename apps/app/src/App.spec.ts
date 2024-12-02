import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';

import { wrapperFactory, router } from '@/common/test';

let wrapper: VueWrapper;

beforeAll(async () => {
  router.push('/');
  await router.isReady();
});

beforeEach(() => {
  wrapper = wrapperFactory(App, {});
});

enableAutoUnmount(afterEach);

describe('App', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(App)).toBeTruthy();
  });
});
