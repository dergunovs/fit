import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import {
  API_ACTIVITY_CHART,
  API_ACTIVITY_STATISTICS,
  API_AUTH_GET,
  API_USER,
  IUserEquipment,
  IUserTemplate,
  IExercise,
  TUserRole,
} from 'fitness-tracker-contracts';
import { dataTest, deleteAuthHeader, createTempId } from 'mhz-helpers';
import { UiTabs } from 'mhz-ui';

import UserForm from './UserForm.vue';
import UserDefaultWeightsForm from './UserDefaultWeightsForm.vue';
import UserExercises from './UserExercises.vue';
import UserFormTab from './UserFormTab.vue';
import UserFormTemplateList from './UserFormTemplateList.vue';
import UserFormTemplateModal from './UserFormTemplateModal.vue';
import UserFormProfile from '@/user/components/UserFormProfile.vue';
import UserFormUpdatePassword from '@/user/components/UserFormUpdatePassword.vue';
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { USER_FIXTURE } from '@/user/fixtures';
import { mockOnSuccess, spyCreateUser, spyUpdateUser, spyDeleteUser } from '@/user/mocks';
import {
  spyRefetchQueries,
  spyRemoveQueries,
  spyRouterPush,
  spyToastSuccess,
  mockIsValid,
  spyLogout,
} from '@/common/mocks';
import { URL_USER } from '@/user/constants';
import { spyGetExercisesAll, spyGetExercisesCustom } from '@/exercise/mocks';
import { EXERCISE_FIXTURE_CUSTOM, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { URL_HOME } from '@/common/constants';
import { TOKEN_NAME } from '@/auth/constants';
import { setAdmin } from '@/auth/composables';
import { spyGetEquipments } from '@/equipment/mocks';

const EMAIL = 'unique@mail.ru';
const NAME = 'Уникум';
const PASSWORD = 'unique';
const EQUIPMENTS: IUserEquipment[] = [];
const TEMPLATE_TITLE = 'Тестовый шаблон';

const form = dataTest('user-form');
const formTabs = dataTest('user-form-tabs');
const formTab = dataTest('user-form-tab');
const formEmail = dataTest('user-form-email');
const formName = dataTest('user-form-name');
const formPassword = dataTest('user-form-password');
const formUpdatePassword = dataTest('user-form-update-password');
const formDefaultWeights = dataTest('user-form-default-weights');
const formButtons = dataTest('user-form-buttons');
const formExercises = dataTest('user-form-exercises');
const formAddExercise = dataTest('user-form-add-exercise');
const formExerciseForm = dataTest('user-form-exercise-form');
const formExerciseFormModal = dataTest('user-form-exercise-form-modal');
const formTemplateList = dataTest('user-form-template-list');
const formAddTemplate = dataTest('user-form-add-template');
const formTemplateModal = dataTest('user-form-template-modal');
const formTemplateModalContainer = dataTest('user-form-template-modal-container');
const formGoalsActivities = dataTest('user-form-goals-activities');
const formGoalsSets = dataTest('user-form-goals-sets');
const formGoalsRepeats = dataTest('user-form-goals-repeats');
const formGoalsDuration = dataTest('user-form-goals-duration');

const wrapperWithUser: VueWrapper<InstanceType<typeof UserForm>> = wrapperFactory(
  UserForm,
  { user: USER_FIXTURE, isEdit: true },
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

    await wrapper.setProps({ user: USER_FIXTURE, isEdit: true });

    expect(wrapper.find(formPassword).exists()).toBe(false);

    await wrapper.setProps({ user: undefined });
  });

  it('shows set new password spoiler only when user exists', async () => {
    expect(wrapper.find(formUpdatePassword).exists()).toBe(false);

    await wrapper.setProps({ user: USER_FIXTURE });

    expect(wrapper.find(formUpdatePassword).exists()).toBe(true);

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
      templates: [],
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
      password: undefined,
      equipments: USER_FIXTURE.equipments,
      templates: USER_FIXTURE.templates,
      defaultWeights: USER_FIXTURE.defaultWeights,
      role: USER_FIXTURE.role,
      goalActivities: USER_FIXTURE.goalActivities,
      goalSets: USER_FIXTURE.goalSets,
      goalRepeats: USER_FIXTURE.goalRepeats,
      goalDuration: USER_FIXTURE.goalDuration,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(4);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_AUTH_GET] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_CHART] });

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

  it('gets equipments', async () => {
    expect(spyGetEquipments).toBeCalledTimes(1);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithUser.find(formButtons).attributes('id')).toBe(USER_FIXTURE._id);
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

    expect(wrapperWithUser.findComponent<typeof UiTabs>(formTabs).props('tabs').length).toBe(5);

    setAdmin(true);

    await nextTick();

    expect(wrapperWithUser.findComponent<typeof UiTabs>(formTabs).props('tabs').length).toBe(4);
  });

  it('creates template', async () => {
    expect(wrapper.find(formTemplateModalContainer).attributes('modelvalue')).toBe('false');

    await wrapper.find(formAddTemplate).trigger('click');

    expect(wrapper.find(formTemplateModalContainer).attributes('modelvalue')).toBe('true');

    const template: IUserTemplate = { _id: createTempId(), title: TEMPLATE_TITLE, exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', template);

    await nextTick();

    expect(wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).props('templates')).toContainEqual(
      template
    );
  });

  it('edits template', async () => {
    await wrapper.find(formAddTemplate).trigger('click');

    const template: IUserTemplate = { _id: createTempId(), title: 'шаблон', exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', template);

    await nextTick();

    const updatedTemplate = { ...template, name: TEMPLATE_TITLE };

    wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).vm.$emit('edit', updatedTemplate);

    await nextTick();

    expect(wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).props('template')).toEqual(
      updatedTemplate
    );
  });

  it('deletes template', async () => {
    await wrapper.find(formAddTemplate).trigger('click');

    const template: IUserTemplate = { _id: createTempId(), title: 'шаблон', exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', template);

    await nextTick();

    expect(wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).props('templates')).toContainEqual(
      template
    );

    wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).vm.$emit('delete', template._id);

    await nextTick();

    expect(wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).exists()).toBe(false);
  });

  it('shows user profile component with correct props', async () => {
    const adminUser = { ...USER_FIXTURE, role: 'admin' as TUserRole };

    await wrapper.setProps({ user: adminUser });

    expect(wrapper.findComponent(UserFormProfile).exists()).toBe(true);
    expect(wrapper.findComponent(UserFormProfile).props('isAdmin')).toBe(true);
    expect(wrapper.findComponent(UserFormProfile).props('isResetPassword')).toBe(adminUser.isResetPassword);
  });

  it('shows goals form with choice components', async () => {
    await wrapper.setProps({ user: USER_FIXTURE, isEdit: true });

    const tabs = wrapper.findComponent<typeof UiTabs>(formTabs);

    tabs.vm.$emit('update:modelValue', 'goals');

    await nextTick();

    expect(wrapper.find(formGoalsActivities).exists()).toBe(true);
    expect(wrapper.find(formGoalsSets).exists()).toBe(true);
    expect(wrapper.find(formGoalsRepeats).exists()).toBe(true);
    expect(wrapper.find(formGoalsDuration).exists()).toBe(true);
  });

  it('handles password update event', async () => {
    await wrapper.setProps({ user: USER_FIXTURE });

    expect(wrapper.findComponent(UserFormUpdatePassword).exists()).toBe(true);

    wrapper.findComponent(UserFormUpdatePassword).vm.$emit('updated');

    await nextTick();

    expect(wrapper.findComponent(UserFormProfile).props('isPasswordUpdated')).toBe(true);
  });

  it('creates exercise and shows modal', async () => {
    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('false');

    await wrapper.find(formAddExercise).trigger('click');

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('true');
    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toBeUndefined();
  });

  it('edits exercise and shows modal with exercise data', async () => {
    const exercise: IExercise = { ...EXERCISE_FIXTURE_CUSTOM, _id: 'test-id' };

    wrapper.findComponent<typeof UserExercises>(formExercises).vm.$emit('edit', exercise);

    await nextTick();

    expect(wrapper.find(formExerciseFormModal).attributes('modelvalue')).toBe('true');
    expect(wrapper.findComponent<typeof ExerciseForm>(formExerciseForm).props('exercise')).toEqual(exercise);
  });

  it('creates template with temp id when no id provided', async () => {
    await wrapper.find(formAddTemplate).trigger('click');

    const templateWithoutId = { title: TEMPLATE_TITLE, exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', templateWithoutId);

    await nextTick();

    const templates = wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).props('templates');

    expect(templates).toHaveLength(1);
    expect(templates[0]._id).toBeDefined();
    expect(templates[0].title).toBe(TEMPLATE_TITLE);
  });

  it('saves template with temp id when no id provided', async () => {
    await wrapper.find(formAddTemplate).trigger('click');

    const templateWithoutId = { title: 'Original', exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', templateWithoutId);

    await nextTick();

    const createdTemplate = wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).props('templates')[0];
    const updatedTemplate = { ...createdTemplate, title: 'Updated' };

    wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).vm.$emit('edit', updatedTemplate);
    await nextTick();

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('edit', updatedTemplate);
    await nextTick();

    const templates = wrapper.findComponent<typeof UserFormTemplateList>(formTemplateList).props('templates');

    expect(templates[0].title).toBe('Updated');
  });

  it('submits form with temp ids removed from templates', async () => {
    mockIsValid.value = true;

    await wrapper.setProps({ user: USER_FIXTURE, isEdit: true });

    await wrapper.find(formAddTemplate).trigger('click');
    const template = { _id: createTempId(), title: 'Test', exercises: [] };

    wrapper.findComponent<typeof UserFormTemplateModal>(formTemplateModal).vm.$emit('create', template);

    await nextTick();

    await wrapper.find(form).trigger('submit');

    expect(spyUpdateUser).toBeCalledTimes(1);
    const calledWith = spyUpdateUser.mock.calls[0][0];

    expect(calledWith.templates?.[0]._id).not.toContain('temp_');
  });

  it('shows correct tabs based on edit mode', async () => {
    expect(wrapper.findComponent<typeof UiTabs>(formTabs).exists()).toBe(false);

    await wrapper.setProps({ user: USER_FIXTURE, isEdit: true });
    expect(wrapper.findComponent<typeof UiTabs>(formTabs).exists()).toBe(true);
  });

  it('shows email field only when creating user', async () => {
    expect(wrapper.find(formEmail).exists()).toBe(true);

    await wrapper.setProps({ user: USER_FIXTURE, isEdit: true });
    expect(wrapper.find(formEmail).exists()).toBe(false);
  });
});
