import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import LayoutAdmin from './LayoutAdmin.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof LayoutAdmin>>;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutAdmin);
});

enableAutoUnmount(afterEach);

describe('LayoutAdmin', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutAdmin)).toBeTruthy();
  });
});
