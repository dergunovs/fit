import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import PromoBlocks from './PromoBlocks.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof PromoBlocks>>;

beforeEach(() => {
  wrapper = wrapperFactory(PromoBlocks);
});

enableAutoUnmount(afterEach);

describe('PromoBlocks', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(PromoBlocks)).toBeTruthy();
  });
});
