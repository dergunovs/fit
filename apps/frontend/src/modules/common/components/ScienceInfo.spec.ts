import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ScienceInfo from './ScienceInfo.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof ScienceInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(ScienceInfo);
});

enableAutoUnmount(afterEach);

describe('ScienceInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ScienceInfo)).toBeTruthy();
  });
});
