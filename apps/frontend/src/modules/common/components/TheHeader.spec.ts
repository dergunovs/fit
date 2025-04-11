import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { deleteAuthHeader, setAuth, dataTest } from 'mhz-helpers';

import TheHeader from './TheHeader.vue';

import { wrapperFactory } from '@/common/test';
import { URL_HOME } from '@/common/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { spyRouterPush, spyLogout, spyInstallPWA } from '@/common/mocks';
import { TOKEN_NAME } from '@/auth/constants';

const logo = dataTest('header-logo');
const pwaInstall = dataTest('header-pwa-install');
const help = dataTest('header-help');
const admin = dataTest('header-admin');
const login = dataTest('header-login');
const registration = dataTest('header-registration');
const logout = dataTest('header-logout');

let wrapper: VueWrapper<InstanceType<typeof TheHeader>>;

beforeAll(() => localStorage.setItem('locale', 'ru'));

beforeEach(() => {
  wrapper = wrapperFactory(TheHeader, { isAdmin: true, isShowInstallPWA: true, installPWA: spyInstallPWA });
});

enableAutoUnmount(afterEach);

describe('TheHeader', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(TheHeader)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets logo link', async () => {
    expect(wrapper.find(logo).attributes('to')).toBe(URL_HOME);
  });

  it('always shows help link', async () => {
    expect(wrapper.find(help).exists()).toBe(true);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(help).exists()).toBe(true);

    setAuth(false);
  });

  it('shows different button to auth users', async () => {
    expect(wrapper.find(login).exists()).toBe(true);
    expect(wrapper.find(registration).exists()).toBe(true);

    expect(wrapper.find(admin).exists()).toBe(false);
    expect(wrapper.find(logout).exists()).toBe(false);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(login).exists()).toBe(false);
    expect(wrapper.find(registration).exists()).toBe(false);

    expect(wrapper.find(admin).exists()).toBe(true);
    expect(wrapper.find(logout).exists()).toBe(true);
  });

  it('hides admin link by props', async () => {
    setAuth(true);

    await nextTick();

    expect(wrapper.find(admin).exists()).toBe(true);

    await wrapper.setProps({ isAdmin: false });

    expect(wrapper.find(admin).exists()).toBe(false);
  });

  it('navigates to admin', async () => {
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.find(admin).trigger('click');

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);
  });

  it('logouts', async () => {
    expect(spyLogout).toBeCalledTimes(0);

    await wrapper.find(logout).trigger('click');

    expect(spyLogout).toBeCalledTimes(1);
    expect(spyLogout).toBeCalledWith(URL_HOME, deleteAuthHeader, TOKEN_NAME);
  });

  it('installs pwa', async () => {
    expect(spyInstallPWA).toBeCalledTimes(0);

    await wrapper.find(pwaInstall).trigger('click');

    expect(spyInstallPWA).toBeCalledTimes(1);
  });

  it('emits show login', async () => {
    setAuth(false);

    await nextTick();

    expect(wrapper.emitted()).not.toHaveProperty('showLogin');

    await wrapper.find(login).trigger('click');

    expect(wrapper.emitted('showLogin')).toHaveLength(1);
  });

  it('emits show registration', async () => {
    setAuth(false);

    await nextTick();

    expect(wrapper.emitted()).not.toHaveProperty('showRegistration');

    await wrapper.find(registration).trigger('click');

    expect(wrapper.emitted('showRegistration')).toHaveLength(1);
  });
});
