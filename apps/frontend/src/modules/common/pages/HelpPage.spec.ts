import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import HelpPage from './HelpPage.vue';

import { wrapperFactory } from '@/common/test';

let wrapper: VueWrapper<InstanceType<typeof HelpPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(HelpPage);
});

enableAutoUnmount(afterEach);

describe('HelpPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(HelpPage)).toBeTruthy();
  });
});
