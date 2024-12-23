import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ErrorPage from './ErrorPage.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ErrorPage, {});
});

enableAutoUnmount(afterEach);

describe('ErrorPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ErrorPage)).toBeTruthy();
  });
});
