import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import MotivationInfo from './MotivationInfo.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof MotivationInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(MotivationInfo);
});

enableAutoUnmount(afterEach);

describe('MotivationInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MotivationInfo)).toBeTruthy();
  });
});
