import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, formatDate } from 'mhz-helpers';
import { UiCalendar } from 'mhz-ui';
import { API_ACTIVITY } from 'fitness-tracker-contracts';

import ActivityForm from './ActivityForm.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyCreateActivity } from '@/activity/mocks';
import { spyRefetchQueries, spyRouterPush, spyToastSuccess } from '@/common/mocks';
import { EXERCISE_CHOOSEN_FIXTURE } from '@/exercise/fixtures';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';
import { spyGetExercisesAll } from '@/exercise/mocks';
import { spyUseAuthCheck } from '@/auth/mocks';

const form = dataTest('activity-form');
const formContainer = dataTest('activity-form-container');
const toggleCalendar = dataTest('activity-form-toggle-calendar');
const addExercise = dataTest('activity-form-add-exercise');
const exerciseChooseList = dataTest('activity-form-exercise-choose-list');
const calendarBlock = dataTest('activity-form-calendar-block');
const calendar = dataTest('activity-form-calendar');
const saveToCalendar = dataTest('activity-form-save-to-calendar');
const dateScheduled = dataTest('activity-form-date-scheduled');

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
    expect(spyGetExercisesAll).toBeCalledTimes(1);
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });

  it('toggles calendar', async () => {
    expect(wrapper.find(calendar).exists()).toBe(false);

    await wrapper.find(toggleCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(true);

    await wrapper.find(toggleCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(false);
  });

  it('adds activity to calendar', async () => {
    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

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

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

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
});
