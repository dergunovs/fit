/* eslint-disable import-x/first */
import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { deleteAuthHeader, setAuth, dataTest } from 'mhz-helpers';

vi.mock('@/common/composables', () => ({
  useTI18n: () => ({ t: (key: string) => key, locale: 'ru' }),
  useLocale: () => ({ toggleLocale: vi.fn() }),
}));

import TheHeader from './TheHeader.vue';

import { wrapperFactory } from '@/common/test';
import { URL_HELP, URL_HOME } from '@/common/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { spyRouterPush, spyLogout } from '@/common/mocks';
import { TOKEN_NAME } from '@/auth/constants';
import { spyUseAuthCheck } from '@/auth/mocks';

const logo = dataTest('header-logo');
const help = dataTest('header-help');
const admin = dataTest('header-admin');
const login = dataTest('header-login');
const registration = dataTest('header-registration');
const logout = dataTest('header-logout');

let wrapper: VueWrapper<InstanceType<typeof TheHeader>>;

beforeAll(() => {
  const mockStorage = {
    store: {} as { [key: string]: string },
    getItem(key: string) {
      return this.store[key] || null;
    },
    setItem(key: string, value: string) {
      this.store[key] = value;
    },
    clear() {
      this.store = {};
    },
  };

  Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true });

  localStorage.setItem('locale', 'ru');
});

beforeEach(() => {
  wrapper = wrapperFactory(TheHeader);
});

enableAutoUnmount(afterEach);

describe('TheHeader', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(TheHeader)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows checks auth', async () => {
    expect(spyUseAuthCheck).toHaveBeenCalledTimes(1);
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

  it('navigates to admin', async () => {
    expect(spyRouterPush).toHaveBeenCalledTimes(0);

    await wrapper.find(admin).trigger('click');

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
    expect(spyRouterPush).toHaveBeenCalledWith(URL_EXERCISE);
  });

  it('navigates to help page', async () => {
    expect(spyRouterPush).toHaveBeenCalledTimes(0);

    await wrapper.find(help).trigger('click');

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
    expect(spyRouterPush).toHaveBeenCalledWith(URL_HELP);
  });

  it('logouts', async () => {
    expect(spyLogout).toHaveBeenCalledTimes(0);

    await wrapper.find(logout).trigger('click');

    expect(spyLogout).toHaveBeenCalledTimes(1);
    expect(spyLogout).toHaveBeenCalledWith(URL_HOME, deleteAuthHeader, TOKEN_NAME);
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

    expect(wrapper.emitted()).not.toHaveProperty('register');

    await wrapper.find(registration).trigger('click');

    expect(wrapper.emitted('register')).toHaveLength(1);
  });
});
