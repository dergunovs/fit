import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY_STATISTICS, API_AUTH_GET, API_USER, IUserEquipment } from 'fitness-tracker-contracts';
import { dataTest, deleteAuthHeader } from 'mhz-helpers';
import { UiTabs } from 'mhz-ui';

import UserForm from './UserForm.vue';
import UserEquipmentForm from './UserEquipmentForm.vue';
import UserDefaultWeightsForm from './UserDefaultWeightsForm.vue';
import UserExercises from './UserExercises.vue';
import UserFormTab from './UserFormTab.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { USER_FIXTURE } from '@/user/fixtures';
import { mockOnSuccess, spyCreateUser, spyUpdateUser, spyDeleteUser, spyUpdateUserPassword } from '@/user/mocks';
import {
  spyRefetchQueries,
  spyRemoveQueries,
  spyRouterPush,
  spyToastSuccess,
  mockIsValid,
  spyLogout,
} from '@/common/mocks';
import { URL_USER } from '@/user/constants';
import { spyGetEquipments } from '@/equipment/mocks';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { spyGetExercisesAll, spyGetExercisesCustom } from '@/exercise/mocks';
import { EXERCISE_FIXTURE_CUSTOM, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { URL_HOME } from '@/common/constants';
import { TOKEN_NAME } from '@/auth/constants';
import { setAdmin } from '@/auth/composables';

const EMAIL = 'unique@mail.ru';
const NAME = 'Уникум';
const PASSWORD = 'unique';
const EQUIPMENTS: IUserEquipment[] = [];

const form = dataTest('user-form');
const formTabs = dataTest('user-form-tabs');
const formTab = dataTest('user-form-tab');
const formEmail = dataTest('user-form-email');
const formName = dataTest('user-form-name');
const formPassword = dataTest('user-form-password');
const formNewPassword = dataTest('user-form-new-password');
const formNewPasswordSpoiler = dataTest('user-form-new-password-spoiler');
const formSetNewPassword = dataTest('user-form-set-new-password');
const formEquipments = dataTest('user-form-equipments');
const formDefaultWeights = dataTest('user-form-default-weights');
const formButtons = dataTest('user-form-buttons');
const formExercises = dataTest('user-form-exercises');
const formAddExercise = dataTest('user-form-add-exercise');
const formExerciseForm = dataTest('user-form-exercise-form');
const formExerciseFormModal = dataTest('user-form-exercise-form-modal');

const wrapperWithUser: VueWrapper<InstanceType<typeof UserForm>> = wrapperFactory(
  UserForm,
  { user: USER_FIXTURE },
  { UserFormTab }
);

let wrapper: VueWrapper<InstanceType<typeof UserForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserForm, {}, { UserFormTab });
});

enableAutoUnmount(afterEach);

describe('UserForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows password field only when creating users', async () => {
    expect(wrapper.find(formPassword).exists()).toBe(true);

    await wrapper.setProps({ user: USER_FIXTURE });

    expect(wrapper.find(formPassword).exists()).toBe(false);

    await wrapper.setProps({ user: undefined });
  });

  it('shows set new password spoiler only when user exists', async () => {
    expect(wrapper.find(formNewPasswordSpoiler).exists()).toBe(false);

    await wrapper.setProps({ user: USER_FIXTURE });

    expect(wrapper.find(formNewPasswordSpoiler).exists()).toBe(true);

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
      defaultWeights: {},
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
      defaultWeights: USER_FIXTURE.defaultWeights,
      role: USER_FIXTURE.role,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(3);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_AUTH_GET] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('updates password', async () => {
    expect(spyUpdateUserPassword).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    const NEW_PASSWORD = '123456';

    await wrapperWithUser.findComponent(formNewPassword).setValue(NEW_PASSWORD);

    await wrapperWithUser.find(formSetNewPassword).trigger('click');

    expect(spyUpdateUserPassword).toBeCalledTimes(1);
    expect(spyUpdateUserPassword).toBeCalledWith({ password: NEW_PASSWORD, id: USER_FIXTURE._id });

    await mockOnSuccess.updatePassword?.();

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('deletes user', async () => {
    expect(spyDeleteUser).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyLogout).toBeCalledTimes(0);

    wrapperWithUser.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', USER_FIXTURE._id);

    expect(spyDeleteUser).toBeCalledTimes(1);
    expect(spyDeleteUser).toBeCalledWith(USER_FIXTURE._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_USER] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyLogout).toBeCalledTimes(1);
    expect(spyLogout).toBeCalledWith(URL_HOME, deleteAuthHeader, TOKEN_NAME);
  });

  it('deletes user with no logout when admin', async () => {
    setAdmin(true);

    expect(spyLogout).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    wrapperWithUser.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', USER_FIXTURE._id);

    expect(spyDeleteUser).toBeCalledTimes(1);

    await mockOnSuccess.delete?.();

    expect(spyLogout).toBeCalledTimes(0);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_USER);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithUser.find(formButtons).attributes('id')).toBe(USER_FIXTURE._id);
  });

  it('gets and sets equipment options', async () => {
    expect(spyGetEquipments).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserEquipmentForm>(formEquipments).props('equipments')).toStrictEqual(
      EQUIPMENTS_FIXTURE
    );
  });

  it('gets and sets default weights and exercises', async () => {
    expect(spyGetExercisesAll).toBeCalledTimes(1);

    expect(
      wrapperWithUser.findComponent<typeof UserDefaultWeightsForm>(formDefaultWeights).props('exercises')
    ).toStrictEqual(EXERCISES_FIXTURE);

    expect(
      wrapperWithUser.findComponent<typeof UserDefaultWeightsForm>(formDefaultWeights).props('userEquipments')
    ).toStrictEqual(USER_FIXTURE.equipments);
  });

  it('gets and sets user custom exercises', async () => {
    expect(spyGetExercisesCustom).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof UserExercises>(formExercises).props('exercises')).toStrictEqual([
      EXERCISE_FIXTURE_CUSTOM,
    ]);
  });

  it('shows form modal by add exercise button click', async () => {
    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('false');

    await wrapper.find(formAddExercise).trigger('click');

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('true');
  });

  it('sets emited exercise to edit in modal', async () => {
    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('false');

    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toStrictEqual(undefined);

    wrapper.findComponent<typeof UserExercises>(formExercises).vm.$emit('edit', EXERCISE_FIXTURE_CUSTOM);

    await nextTick();

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('true');

    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toStrictEqual(
      EXERCISE_FIXTURE_CUSTOM
    );
  });

  it('hides form modal and clears current exercise by hide emit', async () => {
    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof UserExercises>(formExercises).vm.$emit('edit', EXERCISE_FIXTURE_CUSTOM);

    await nextTick();

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('true');

    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toStrictEqual(
      EXERCISE_FIXTURE_CUSTOM
    );

    wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).vm.$emit('hide');

    await nextTick();

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('false');

    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toStrictEqual(undefined);
  });

  it('shows only one tab in user create form', async () => {
    expect(wrapper.findAll(formTab)[0].isVisible()).toBe(true);
    expect(wrapper.findAll(formTab)[1].isVisible()).toBe(false);

    expect(wrapperWithUser.findAll(formTab)[0].isVisible()).toBe(true);
    expect(wrapperWithUser.findAll(formTab)[1].isVisible()).toBe(true);
  });

  it('shows tabs for admin user', async () => {
    setAdmin(false);

    await nextTick();

    expect(wrapperWithUser.findComponent<typeof UiTabs>(formTabs).props('tabs').length).toBe(4);

    setAdmin(true);

    await nextTick();

    expect(wrapperWithUser.findComponent<typeof UiTabs>(formTabs).props('tabs').length).toBe(3);
  });
});
