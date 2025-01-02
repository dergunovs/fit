import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import SetupPage from './SetupPage.vue';

import { dataTest, wrapperFactory } from '@/common/test';

const authForm = dataTest('setup-page-auth-form');

let wrapper: VueWrapper<InstanceType<typeof SetupPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(SetupPage);
});

enableAutoUnmount(afterEach);

describe('SetupPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(SetupPage)).toBeTruthy();
  });

  it('shows auth setup form', async () => {
    expect(wrapper.find(authForm).attributes('isSetup'.toLocaleLowerCase())).toBe('true');
  });
});
