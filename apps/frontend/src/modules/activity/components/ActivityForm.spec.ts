import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { deleteTempId, dataTest, formatDate } from 'mhz-helpers';
import { UiCalendar } from 'mhz-ui';
import { API_ACTIVITY } from 'fitness-tracker-contracts';

import ActivityForm from './ActivityForm.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_STATISTICS_FIXTURE, ACTIVITY_FIXTURE, ACTIVITY_FIXTURE_2 } from '@/activity/fixtures';
import { mockOnSuccess, spyCreateActivity, spyGetActivity, spyGetActivityLast } from '@/activity/mocks';
import { spyGetExercisesAll } from '@/exercise/mocks';
import {
  mockRouteId,
  mockTempId,
  spyRefetchQueries,
  spyRouterPush,
  spyToastSuccess,
  spyUseRouteId,
} from '@/common/mocks';
import { EXERCISE_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_2_FIXTURE } from '@/exercise/fixtures';
import { generateActivityExercises, getPotentialActivityDuration } from '@/activity/helpers';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { URL_HOME } from '@/common/constants';

const averageRestPercent = 50;

const existingExercises = generateActivityExercises(ACTIVITY_FIXTURE.exercises);

const form = dataTest('activity-form');
const formContainer = dataTest('activity-form-container');
const potentialDuration = dataTest('activity-form-potential-duration');
const repeatLast = dataTest('activity-form-repeat-last');
const addToCalendar = dataTest('activity-form-add-to-calendar');
const addExercise = dataTest('activity-form-add-exercise');
const addExerciseModal = dataTest('activity-form-add-exercise-modal');
const exerciseChooseList = dataTest('activity-form-exercise-choose-list');
const exercisesChoosenContainer = dataTest('activity-form-exercises-choosen-container');
const exercisesChoosen = dataTest('activity-form-exercises-choosen');
const calendarBlock = dataTest('activity-form-calendar-block');
const calendar = dataTest('activity-form-calendar');
const saveToCalendar = dataTest('activity-form-save-to-calendar');
const dateScheduled = dataTest('activity-form-date-scheduled');
const submit = dataTest('activity-form-submit');

let wrapper: VueWrapper<InstanceType<typeof ActivityForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityForm, {
    exerciseStatistics: ACTIVITIES_STATISTICS_FIXTURE.exercise,
    averageRestPercent,
  });
});

enableAutoUnmount(afterEach);

describe('ActivityForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets exercises, last activity and activity to copy', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('copy', true);

    expect(spyGetExercisesAll).toBeCalledTimes(1);

    expect(spyGetActivityLast).toBeCalledTimes(1);

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({ enabled: !!mockRouteId.value }, mockRouteId);
  });

  it('adds and deletes exercises', async () => {
    expect(
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$props.choosenExercises
    ).toStrictEqual([...existingExercises]);

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toBe('false');

    await wrapper.find(addExercise).trigger('click');

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

    await nextTick();

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toBe('false');
    expect(wrapper.find(exercisesChoosenContainer).exists()).toBe(true);

    expect(
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$props.choosenExercises
    ).toStrictEqual([...existingExercises, EXERCISE_CHOOSEN_FIXTURE]);

    wrapper
      .findComponent<typeof ExerciseChoosenList>(exercisesChoosen)
      .vm.$emit('delete', EXERCISE_CHOOSEN_FIXTURE._id);

    existingExercises.forEach((exercise) => {
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$emit('delete', exercise._id);
    });

    await nextTick();

    expect(wrapper.find(exercisesChoosenContainer).exists()).toBe(false);
  });

  it('creates set', async () => {
    await wrapper.find(addExercise).trigger('click');

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

    await nextTick();

    await wrapper.find(addExercise).trigger('click');

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_2_FIXTURE);

    await nextTick();

    expect(
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$props.choosenExercises
    ).toStrictEqual([...existingExercises, EXERCISE_CHOOSEN_FIXTURE, EXERCISE_CHOOSEN_2_FIXTURE]);

    wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$emit('createSet');

    await nextTick();

    expect(
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$props.choosenExercises
    ).toStrictEqual([
      ...existingExercises,
      EXERCISE_CHOOSEN_FIXTURE,
      EXERCISE_CHOOSEN_2_FIXTURE,
      { ...EXERCISE_CHOOSEN_FIXTURE, _id: mockTempId },
      { ...EXERCISE_CHOOSEN_2_FIXTURE, _id: mockTempId },
    ]);
  });

  it('disables submit button if no exercises added', async () => {
    existingExercises.forEach((exercise) => {
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$emit('delete', exercise._id);
    });

    await nextTick();

    expect(wrapper.find(submit).attributes('isdisabled')).toBe('true');

    await wrapper.find(addExercise).trigger('click');

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

    await nextTick();

    expect(wrapper.find(submit).attributes('isdisabled')).toBe(undefined);
  });

  it('repeats last activity', async () => {
    await wrapper.find(repeatLast).trigger('click');

    expect(
      wrapper.findComponent<typeof ExerciseChoosenList>(exercisesChoosen).vm.$props.choosenExercises
    ).toStrictEqual(generateActivityExercises(ACTIVITY_FIXTURE_2.exercises));
  });

  it('shows potential activity duration', async () => {
    expect(wrapper.find(potentialDuration).text()).toBe('0');

    await wrapper.find(addExercise).trigger('click');

    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

    await nextTick();

    expect(wrapper.find(potentialDuration).text()).toBe(
      getPotentialActivityDuration(
        [EXERCISE_CHOOSEN_FIXTURE],
        'ru',
        ACTIVITIES_STATISTICS_FIXTURE.exercise,
        averageRestPercent
      )
    );
  });

  it('toggles calendar', async () => {
    expect(wrapper.find(calendar).exists()).toBe(false);

    await wrapper.find(addToCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(true);

    await wrapper.find(addToCalendar).trigger('click');

    expect(wrapper.find(calendarBlock).exists()).toBe(false);
  });

  it('adds activity to calendar', async () => {
    wrapper.findComponent<typeof ExerciseChooseList>(exerciseChooseList).vm.$emit('choose', EXERCISE_CHOOSEN_FIXTURE);

    await nextTick();

    await wrapper.find(addToCalendar).trigger('click');

    expect(wrapper.find(dateScheduled).exists()).toBe(false);

    const date = new Date();

    wrapper.findComponent<typeof UiCalendar>(calendar).vm.$emit('chooseDate', date);

    await nextTick();

    expect(wrapper.find(dateScheduled).text()).toBe(formatDate(date, 'ru'));

    await wrapper.find(saveToCalendar).trigger('click');

    date.setHours(23, 59, 59);

    expect(spyCreateActivity).toBeCalledTimes(1);
    expect(spyCreateActivity).toBeCalledWith({
      dateScheduled: date,
      exercises: deleteTempId([...existingExercises, EXERCISE_CHOOSEN_FIXTURE]),
      isDone: false,
    });

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
    expect(spyCreateActivity).toBeCalledWith({
      exercises: deleteTempId([...existingExercises, EXERCISE_CHOOSEN_FIXTURE]),
      isDone: false,
    });

    const activityId = '123123';

    await mockOnSuccess.create?.(activityId);

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(`${URL_ACTIVITY_EDIT}/${activityId}`);
  });
});
