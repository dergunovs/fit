import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import UserEditPage from './UserEditPage.vue';
import UserForm from '@/user/components/UserForm.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { spyGetUser } from '@/user/mocks';
import { USER_FIXTURE } from '@/user/fixtures';

const userForm = dataTest('edit-user-form');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(UserEditPage, {});
});

enableAutoUnmount(afterEach);

describe('UserEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserEditPage)).toBeTruthy();
  });

  it('gets and sets user to form', async () => {
    expect(spyGetUser).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserForm>(userForm).vm.$props.user).toEqual(USER_FIXTURE);
  });
});
