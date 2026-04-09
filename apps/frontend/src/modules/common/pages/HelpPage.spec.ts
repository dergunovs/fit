import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import HelpPage from './HelpPage.vue';

import { wrapperFactory } from '@/common/test';

const MOCK_UPLOAD_PATH = 'http://localhost:5000';

let wrapper: VueWrapper<InstanceType<typeof HelpPage>>;

beforeEach(() => {
  vi.stubEnv('VITE_PATH_UPLOAD', MOCK_UPLOAD_PATH);
  wrapper = wrapperFactory(HelpPage);
});

enableAutoUnmount(afterEach);

describe('HelpPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(HelpPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
