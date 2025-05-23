import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';
import { API_ACTIVITY_CALENDAR, API_ACTIVITY_CHART, API_ACTIVITY_STATISTICS } from 'fitness-tracker-contracts';

import AuthForm from './AuthForm.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyLogin, spyResetPassword, spySetup } from '@/auth/mocks';
import {
  spyAuth,
  spySetAuthHeaders,
  spyRouterPush,
  spyToastSuccess,
  mockIsValid,
  spyRefetchQueries,
} from '@/common/mocks';
import { URL_HOME } from '@/common/constants';
import { TOKEN_FIXTURE } from '@/auth/fixtures';
import { TOKEN_NAME } from '@/auth/constants';

const EMAIL = 'a@b.ru';
const PASSWORD = 'qwerty';

const ID = 'vf9gwr9bunrwber';
const NAME = 'Иван';

const form = dataTest('auth-form');
const formHeader = dataTest('auth-form-header');
const formEmail = dataTest('auth-form-email');
const formPassword = dataTest('auth-form-password');
const formPasswordResetButton = dataTest('auth-form-password-reset-button');
const formPasswordResetInfo = dataTest('auth-form-password-reset-info');
const formSubmitButton = dataTest('auth-form-submit-button');

let wrapper: VueWrapper<InstanceType<typeof AuthForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(AuthForm, { isSetup: false });
});

enableAutoUnmount(afterEach);

describe('AuthForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(AuthForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows form header and submit button text', async () => {
    expect(wrapper.find(formHeader).text()).toBe('Вход');
    expect(wrapper.find(formSubmitButton).text()).toBe('Войти');

    await wrapper.setProps({ isSetup: true });

    expect(wrapper.find(formHeader).text()).toBe('Создать администратора');
    expect(wrapper.find(formSubmitButton).text()).toBe('Создать');
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyLogin).toBeCalledTimes(0);

    mockIsValid.value = true;
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

    await mockOnSuccess.login?.({ user: { _id: ID, email: EMAIL, name: NAME }, token: TOKEN_FIXTURE });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyAuth).toBeCalledTimes(1);
    expect(spyAuth).toBeCalledWith(TOKEN_FIXTURE, spySetAuthHeaders, TOKEN_NAME);

    expect(wrapper.emitted('login')).toHaveLength(1);

    expect(spyRefetchQueries).toBeCalledTimes(3);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_CALENDAR] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_CHART] });
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

    await mockOnSuccess.setup?.();

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });

  it('shows reset password info and hides password input', async () => {
    expect(wrapper.find(formPasswordResetInfo).exists()).toBe(false);
    expect(wrapper.find(formPassword).exists()).toBe(true);

    await wrapper.find(formPasswordResetButton).trigger('click');

    expect(wrapper.find(formPasswordResetInfo).exists()).toBe(true);
    expect(wrapper.find(formPassword).exists()).toBe(false);
  });

  it('resets password', async () => {
    await wrapper.find(formPasswordResetButton).trigger('click');

    expect(spyResetPassword).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(wrapper.emitted()).not.toHaveProperty('reset');

    await wrapper.findComponent(formEmail).setValue(EMAIL);

    await wrapper.find(form).trigger('submit');

    expect(spyResetPassword).toBeCalledTimes(1);
    expect(spyResetPassword).toBeCalledWith({ email: EMAIL });

    await mockOnSuccess.resetPassword?.();

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(wrapper.emitted('reset')).toHaveLength(1);
  });
});
