import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormUpdatePassword from './UserFormUpdatePassword.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyUpdateUserPassword } from '@/user/mocks';
import { spyToastSuccess } from '@/common/mocks';

const input = dataTest('user-form-update-password-input');
const button = dataTest('user-form-update-password-button');

let wrapper: VueWrapper<InstanceType<typeof UserFormUpdatePassword>>;

const NEW_PASSWORD = '123456';
const ID = 'gfhrtj46j4y54hhrt';

beforeEach(() => {
  wrapper = wrapperFactory(UserFormUpdatePassword, { id: ID });
});

enableAutoUnmount(afterEach);

describe('UserFormUpdatePassword', () => {
  it('exists', () => {
    expect(wrapper.findComponent(UserFormUpdatePassword)).toBeTruthy();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('disables button when password is less than 6 characters', async () => {
    expect(wrapper.find(button).attributes('isdisabled')).toBe('true');

    await wrapper.findComponent(input).setValue('12345');

    await wrapper.find(button).trigger('click');

    expect(wrapper.find(button).attributes('isdisabled')).toBe('true');

    await wrapper.findComponent(input).setValue(NEW_PASSWORD);

    expect(wrapper.find(button).attributes('isdisabled')).toBe('false');
  });

  it('updates password', async () => {
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyUpdateUserPassword).toBeCalledTimes(0);

    await wrapper.findComponent(input).setValue('123456');

    await wrapper.find(button).trigger('click');

    await mockOnSuccess.updatePassword?.();

    expect(spyToastSuccess).toBeCalledTimes(1);
    expect(spyUpdateUserPassword).toBeCalledTimes(1);
    expect(spyUpdateUserPassword).toBeCalledWith({ password: NEW_PASSWORD, id: ID });
  });
});
