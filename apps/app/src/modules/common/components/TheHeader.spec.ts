import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { deleteAuthHeader, setAuth } from 'mhz-helpers';

import TheHeader from './TheHeader.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { URL_HOME } from '@/common/constants';
import { URL_ACTIVITY_CREATE } from '@/activity/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { spyRouterPush, spyLogout } from '@/common/mocks';
import { TOKEN_NAME } from '@/auth/constants';

const logo = dataTest('header-logo');
const admin = dataTest('header-admin');
const activity = dataTest('header-activity');
const login = dataTest('header-login');
const logout = dataTest('header-logout');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(TheHeader, {});
});

enableAutoUnmount(afterEach);

describe('TheHeader', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(TheHeader)).toBeTruthy();
  });

  it('sets logo link', async () => {
    expect(wrapper.find(logo).attributes('to')).toBe(URL_HOME);
  });

  it('shows different button to auth users', async () => {
    expect(wrapper.find(login).exists()).toBe(true);

    expect(wrapper.find(admin).exists()).toBe(false);
    expect(wrapper.find(activity).exists()).toBe(false);
    expect(wrapper.find(logout).exists()).toBe(false);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(login).exists()).toBe(false);

    expect(wrapper.find(admin).exists()).toBe(true);
    expect(wrapper.find(activity).exists()).toBe(true);
    expect(wrapper.find(logout).exists()).toBe(true);
  });

  it('navigates to admin and activity', async () => {
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.find(admin).trigger('click');

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);

    await wrapper.find(activity).trigger('click');

    expect(spyRouterPush).toBeCalledTimes(2);
    expect(spyRouterPush).toBeCalledWith(URL_ACTIVITY_CREATE);
  });

  it('logouts', async () => {
    expect(spyLogout).toBeCalledTimes(0);

    await wrapper.find(logout).trigger('click');

    expect(spyLogout).toBeCalledTimes(1);
    expect(spyLogout).toBeCalledWith(URL_HOME, deleteAuthHeader, TOKEN_NAME);
  });

  it('emits show login', async () => {
    setAuth(false);

    await nextTick();

    expect(wrapper.emitted()).not.toHaveProperty('showLogin');

    await wrapper.find(login).trigger('click');

    expect(wrapper.emitted('showLogin')).toHaveLength(1);
  });
});
