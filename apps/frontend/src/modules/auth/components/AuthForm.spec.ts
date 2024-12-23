import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import AuthForm from './AuthForm.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { onSuccess, spyLogin, spySetup } from '@/auth/mocks';
import { spyAuth, spySetAuthHeaders, spyRouterPush, spyToastSuccess } from '@/common/mocks';
import { URL_ACTIVITY_CREATE } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';
import {
  TOKEN_NAME,
  AUTH_FORM_HEADER_SETUP,
  AUTH_FORM_HEADER_LOGIN,
  AUTH_FORM_SUBMIT_BUTTON_SETUP,
  AUTH_FORM_SUBMIT_BUTTON_LOGIN,
} from '@/auth/constants';

const EMAIL = 'a@b.ru';
const PASSWORD = 'qwerty';

const ID = 'vf9gwr9bunrwber';
const NAME = 'Иван';
const TOKEN = 'fdigheburb09ure0hr9g9ureu9bhr9ugh9rh94hvre';

const form = dataTest('auth-form');
const formHeader = dataTest('auth-form-header');
const formEmail = dataTest('auth-form-email');
const formPassword = dataTest('auth-form-password');
const formSubmitButton = dataTest('auth-form-submit-button');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(AuthForm, {
    props: {
      isSetup: false,
    },
  });
});

enableAutoUnmount(afterEach);

describe('AuthForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(AuthForm)).toBeTruthy();
  });

  it('shows form header and submit button text', async () => {
    expect(wrapper.find(formHeader).text()).toBe(AUTH_FORM_HEADER_LOGIN);
    expect(wrapper.find(formSubmitButton).text()).toBe(AUTH_FORM_SUBMIT_BUTTON_LOGIN);

    await wrapper.setProps({ isSetup: true });

    expect(wrapper.find(formHeader).text()).toBe(AUTH_FORM_HEADER_SETUP);
    expect(wrapper.find(formSubmitButton).text()).toBe(AUTH_FORM_SUBMIT_BUTTON_SETUP);
  });

  it('handles login by form submit', async () => {
    expect(spyLogin).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyAuth).toBeCalledTimes(0);
    expect(wrapper.emitted()).not.toHaveProperty('login');
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formEmail).setValue(EMAIL);
    await wrapper.findComponent(formPassword).setValue(PASSWORD);

    await wrapper.find(form).trigger('submit');

    expect(spyLogin).toBeCalledTimes(1);
    expect(spyLogin).toBeCalledWith({ email: EMAIL, password: PASSWORD });

    await onSuccess.login?.({ _id: ID, email: EMAIL, name: NAME, token: TOKEN });

    expect(spyToastSuccess).toBeCalledTimes(1);
    expect(spyAuth).toBeCalledTimes(1);
    expect(spyAuth).toBeCalledWith(TOKEN, spySetAuthHeaders, TOKEN_NAME);
    expect(wrapper.emitted('login')).toHaveLength(1);
    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_ACTIVITY_CREATE);
  });

  it('handles setup by form submit', async () => {
    await wrapper.setProps({ isSetup: true });

    expect(spySetup).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formEmail).setValue(EMAIL);
    await wrapper.findComponent(formPassword).setValue(PASSWORD);

    await wrapper.find(form).trigger('submit');

    expect(spySetup).toBeCalledTimes(1);
    expect(spySetup).toBeCalledWith({ email: EMAIL, password: PASSWORD });

    await onSuccess.setup?.();

    expect(spyToastSuccess).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });
});
