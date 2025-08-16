import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormProfile from './UserFormProfile.vue';

import { wrapperFactory } from '@/common/test';

const admin = dataTest('user-form-profile-admin');
const resetPassword = dataTest('user-form-profile-reset-password');

let wrapper: VueWrapper<InstanceType<typeof UserFormProfile>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserFormProfile, { isAdmin: true });
});

enableAutoUnmount(afterEach);

describe('UserFormProfile', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormProfile)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows admin role in header', async () => {
    expect(wrapper.find(admin).exists()).toBe(true);

    await wrapper.setProps({ isAdmin: false });

    expect(wrapper.find(admin).exists()).toBe(false);
  });

  it('shows reset password message in header', async () => {
    expect(wrapper.find(resetPassword).exists()).toBe(false);

    await wrapper.setProps({ isResetPassword: true });

    expect(wrapper.find(resetPassword).exists()).toBe(true);

    await wrapper.setProps({ isPasswordUpdated: true });

    expect(wrapper.find(resetPassword).exists()).toBe(false);
  });
});
