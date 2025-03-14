import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserCreatePage from './UserCreatePage.vue';

import { wrapperFactory } from '@/common/test';

const userForm = dataTest('user-form');

let wrapper: VueWrapper<InstanceType<typeof UserCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserCreatePage);
});

enableAutoUnmount(afterEach);

describe('UserCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserCreatePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows user form', async () => {
    expect(wrapper.find(userForm).exists()).toBe(true);
  });
});
