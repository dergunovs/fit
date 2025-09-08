import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, formatDate } from 'mhz-helpers';
import { UiCalendar } from 'mhz-ui';
import { API_ACTIVITY, API_AUTH_GET, API_USER } from 'fitness-tracker-contracts';

import ActivityForm from './ActivityForm.vue';
import ExerciseManagment from '@/exercise/components/ExerciseManagment.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';
import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyCreateActivity } from '@/activity/mocks';
import { mockOnSuccess as mockOnSuccessUser, spyUpdateUser } from '@/user/mocks';
import { spyRefetchQueries, spyRouterPush, spyToastSuccess } from '@/common/mocks';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';
import { spyUseAuthCheck } from '@/auth/mocks';
import { USER_FIXTURE, USER_TEMPLATE } from '@/user/fixtures';

const form = dataTest('activity-form');
const formContainer = dataTest('activity-form-container');
const toggleCalendar = dataTest('activity-form-toggle-calendar');
const addExercise = dataTest('activity-form-add-exercise');
const exerciseManagment = dataTest('activity-form-exercise-managment');
const calendarBlock = dataTest('activity-form-calendar-block');
const calendar = dataTest('activity-form-calendar');
const saveToCalendar = dataTest('activity-form-save-to-calendar');
const dateScheduled = dataTest('activity-form-date-scheduled');
const templatesButton = dataTest('activity-form-templates');
const templatesModal = dataTest('activity-form-templates-modal');
const potentialDuration = dataTest('activity-form-potential-duration');
const createTemplate = dataTest('activity-form-create-template');
const templateTitle = dataTest('activity-form-template-title');

let wrapper: VueWrapper<InstanceType<typeof ActivityForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityForm, {}, { FormButtonsLayout });
});

enableAutoUnmount(afterEach);

describe('ActivityForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets initial data', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });

  it('shows potential duration component with exercises', async () => {
    expect(wrapper.findComponent(ActivityPotentialDuration).exists()).toBe(true);

    expect(wrapper.findComponent<typeof ActivityPotentialDuration>(potentialDuration).props('exercises')).toEqual([]);
  });

  it('toggles calendar', async () => {
    expect(wrapper.find(calendar).exists()).toBe(false);

    await wrapper.find(toggleCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(true);

    await wrapper.find(toggleCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(false);
  });

  it('adds activity to calendar', async () => {
    wrapper
      .findComponent<typeof ExerciseManagment>(exerciseManagment)
      .vm.$emit('update:modelValue', USER_TEMPLATE.exercises);

    await nextTick();

    await wrapper.find(toggleCalendar).trigger('click');

    expect(wrapper.find(dateScheduled).exists()).toBe(false);

    const date = new Date();

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('chooseDate', date);

    await nextTick();

    expect(wrapper.find(dateScheduled).text()).toBe(formatDate(date, 'ru'));

    await wrapper.find(saveToCalendar).trigger('click');

    date.setHours(23, 59, 59);

    expect(spyCreateActivity).toBeCalledTimes(1);

    const activityId = '123123';

    await mockOnSuccess.create?.(activityId);

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });

  it('creates activity', async () => {
    expect(spyCreateActivity).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    expect(wrapper.find(formContainer).exists()).toBe(true);

    await wrapper.find(addExercise).trigger('click');

    wrapper
      .findComponent<typeof ExerciseManagment>(exerciseManagment)
      .vm.$emit('update:modelValue', USER_TEMPLATE.exercises);

    await nextTick();

    await wrapper.find(form).trigger('submit');

    expect(wrapper.find(formContainer).exists()).toBe(false);

    expect(spyCreateActivity).toBeCalledTimes(1);

    const activityId = '123123';

    await mockOnSuccess.create?.(activityId);

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(`${URL_ACTIVITY_EDIT}/${activityId}`);
  });

  it('opens templates modal', async () => {
    expect(wrapper.find(templatesModal).attributes('modelvalue')).toBe('false');

    await wrapper.find(templatesButton).trigger('click');

    expect(wrapper.find(templatesModal).attributes('modelvalue')).toBe('true');
  });

  it('creates template from current exercises', async () => {
    const TEMPLATE_TITLE = 'Мой шаблон';

    await wrapper.find(addExercise).trigger('click');

    wrapper
      .findComponent<typeof ExerciseManagment>(exerciseManagment)
      .vm.$emit('update:modelValue', USER_TEMPLATE.exercises);

    await nextTick();

    await wrapper.find(templatesButton).trigger('click');

    await wrapper.findComponent(templateTitle).setValue(TEMPLATE_TITLE);

    await wrapper.find(createTemplate).trigger('click');

    await mockOnSuccessUser.update?.();

    expect(spyUpdateUser).toBeCalledTimes(1);
    expect(spyUpdateUser).toBeCalledWith({
      ...USER_FIXTURE,
      templates: [USER_TEMPLATE, { title: TEMPLATE_TITLE, exercises: USER_TEMPLATE.exercises }],
    });

    expect(spyRefetchQueries).toBeCalledTimes(2);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_AUTH_GET] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('prevents submission when no exercises selected', async () => {
    expect(spyCreateActivity).toBeCalledTimes(0);

    await wrapper.find(form).trigger('submit');

    expect(spyCreateActivity).toBeCalledTimes(0);
  });
});
