import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import App from './App.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof App>>;

beforeAll(() => {
  const mockStorage = {
    store: {} as { [key: string]: string },
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value;
    },
    clear() {
      this.store = {};
    },
  };

  Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true });
});

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
