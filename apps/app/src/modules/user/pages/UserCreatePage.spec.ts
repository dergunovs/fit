import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import UserCreatePage from './UserCreatePage.vue';

import { dataTest, wrapperFactory } from '@/common/test';

const userForm = dataTest('user-form');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(UserCreatePage, {});
});

enableAutoUnmount(afterEach);

describe('UserCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserCreatePage)).toBeTruthy();
  });

  it('shows user form', async () => {
    expect(wrapper.find(userForm).exists()).toBe(true);
  });
});
