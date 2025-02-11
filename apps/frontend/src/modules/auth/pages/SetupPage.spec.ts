import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import SetupPage from './SetupPage.vue';

import { wrapperFactory } from '@/common/test';

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

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows auth setup form', async () => {
    expect(wrapper.find(authForm).attributes('isSetup'.toLocaleLowerCase())).toBe('true');
  });
});
