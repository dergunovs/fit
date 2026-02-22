import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import RegistrationForm from './RegistrationForm.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyRegister } from '@/auth/mocks';
import { spyToastSuccess, mockIsValid } from '@/common/mocks';

const EMAIL = 'a@b.ru';
const NAME = 'Иван';
const PASSWORD = 'qwerty';

const form = dataTest('registration-form');
const formEmail = dataTest('registration-form-email');
const formName = dataTest('registration-form-name');
const formPassword = dataTest('registration-form-password');

let wrapper: VueWrapper<InstanceType<typeof RegistrationForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(RegistrationForm);
});

enableAutoUnmount(afterEach);

describe('RegistrationForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(RegistrationForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyRegister).toHaveBeenCalledTimes(0);

    mockIsValid.value = true;
  });

  it('handles registration by form submit', async () => {
    expect(spyRegister).toHaveBeenCalledTimes(0);
    expect(spyToastSuccess).toHaveBeenCalledTimes(0);
    expect(wrapper.emitted()).not.toHaveProperty('register');

    await wrapper.findComponent(formEmail).setValue(EMAIL);
    await wrapper.findComponent(formName).setValue(NAME);
    await wrapper.findComponent(formPassword).setValue(PASSWORD);

    await wrapper.find(form).trigger('submit');

    expect(spyRegister).toHaveBeenCalledTimes(1);
    expect(spyRegister).toHaveBeenCalledWith({ email: EMAIL, name: NAME, password: PASSWORD });

    await mockOnSuccess.register?.();

    expect(wrapper.emitted('register')).toHaveLength(1);
    expect(spyToastSuccess).toHaveBeenCalledTimes(1);
  });
});
