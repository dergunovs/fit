import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserProfilePage from './UserProfilePage.vue';
import UserForm from '@/user/components/UserForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyUseAuthCheck } from '@/auth/mocks';
import { USER_FIXTURE } from '@/user/fixtures';

const userForm = dataTest('user-form');

let wrapper: VueWrapper<InstanceType<typeof UserProfilePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserProfilePage);
});

enableAutoUnmount(afterEach);

describe('UserProfilePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserProfilePage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets user to form', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserForm>(userForm).vm.$props.user).toStrictEqual(USER_FIXTURE);
  });
});
