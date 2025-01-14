import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY_STATISTICS, API_AUTH_GET, API_USER, IUser, IUserEquipment } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import UserForm from './UserForm.vue';
import UserEquipmentForm from './UserEquipmentForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { USER_FIXTURE } from '@/user/fixtures';
import { mockOnSuccess, spyCreateUser, spyUpdateUser, spyDeleteUser } from '@/user/mocks';
import { spyRefetchQueries, spyRemoveQueries, spyRouterPush, spyToastSuccess, mockIsValid } from '@/common/mocks';
import { URL_USER } from '@/user/constants';
import { spyGetEquipments } from '@/equipment/mocks';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';

const EMAIL = 'unique@mail.ru';
const NAME = 'Уникум';
const PASSWORD = 'unique';
const EQUIPMENTS: IUserEquipment[] = [];

const form = dataTest('user-form');
const formAdmin = dataTest('user-form-admin');
const formEmail = dataTest('user-form-email');
const formName = dataTest('user-form-name');
const formPassword = dataTest('user-form-password');
const formEquipments = dataTest('user-form-equipments');
const formButtons = dataTest('user-form-buttons');

const wrapperWithUser: VueWrapper<InstanceType<typeof UserForm>> = wrapperFactory(UserForm, { user: USER_FIXTURE });

let wrapper: VueWrapper<InstanceType<typeof UserForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserForm);
});

enableAutoUnmount(afterEach);

describe('UserForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserForm)).toBeTruthy();
  });

  it('shows admin role header', async () => {
    const adminUser: IUser = { _id: '1', role: 'admin', email: 'a@b.ru' };

    expect(wrapper.find(formAdmin).exists()).toBe(false);

    await wrapper.setProps({ user: adminUser });

    expect(wrapper.find(formAdmin).exists()).toBe(true);
  });

  it('shows password field only when creating users', async () => {
    expect(wrapper.find(formPassword).exists()).toBe(true);

    await wrapper.setProps({ user: USER_FIXTURE });

    expect(wrapper.find(formPassword).exists()).toBe(false);

    await wrapper.setProps({ user: undefined });
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyCreateUser).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('creates user', async () => {
    expect(spyCreateUser).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formEmail).setValue(EMAIL);
    await wrapper.findComponent(formName).setValue(NAME);
    await wrapper.findComponent(formPassword).setValue(PASSWORD);

    await wrapper.find(form).trigger('submit');

    expect(spyCreateUser).toBeCalledTimes(1);
    expect(spyCreateUser).toBeCalledWith({
      email: EMAIL,
      name: NAME,
      password: PASSWORD,
      equipments: EQUIPMENTS,
      role: 'user',
    });

    await mockOnSuccess.create?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_USER);
  });

  it('updates user', async () => {
    expect(spyUpdateUser).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    const NEW_NAME = 'Олег';

    await wrapperWithUser.findComponent(formName).setValue(NEW_NAME);

    await wrapperWithUser.find(form).trigger('submit');

    expect(spyUpdateUser).toBeCalledTimes(1);
    expect(spyUpdateUser).toBeCalledWith({
      _id: USER_FIXTURE._id,
      email: USER_FIXTURE.email,
      name: NEW_NAME,
      password: USER_FIXTURE.password,
      equipments: USER_FIXTURE.equipments,
      role: USER_FIXTURE.role,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(3);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_AUTH_GET] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('deletes user', async () => {
    expect(spyDeleteUser).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    wrapperWithUser.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', USER_FIXTURE._id);

    expect(spyDeleteUser).toBeCalledTimes(1);
    expect(spyDeleteUser).toBeCalledWith(USER_FIXTURE._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_USER] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_USER);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithUser.find(formButtons).attributes('id')).toBe(USER_FIXTURE._id);
  });

  it('gets and sets equipment options', async () => {
    expect(spyGetEquipments).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserEquipmentForm>(formEquipments).vm.$props.equipments).toStrictEqual(
      EQUIPMENTS_FIXTURE
    );
  });
});
