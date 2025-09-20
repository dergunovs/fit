import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDate, subtractDates, setAuth, dataTest } from 'mhz-helpers';
import { UiModal } from 'mhz-ui';
import { API_ACTIVITY, API_ACTIVITY_CALENDAR } from 'fitness-tracker-contracts';

import ActivityInfo from './ActivityInfo.vue';
import MuscleStatistics from '@/muscle/components/MuscleStatistics.vue';
import ExerciseElement from '@/exercise/components/ExerciseElement.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_ALL_DONE_FIXTURE, EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { getRestPercent, getToFailurePercent } from '@/activity/helpers';
import { mockOnSuccess, spyDeleteActivity } from '@/activity/mocks';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { generateMuscleStatistics } from '@/muscle/helpers';
import { spyGetMuscles } from '@/muscle/mocks';
import {
  spyRefetchQueries,
  spyRemoveQueries,
  spyRouterPush,
  spyToastSuccess,
  spyCopyToClipboard,
  spyRouterGo,
} from '@/common/mocks';

const activityInfo = dataTest('activity-info');
const timeline = dataTest('activity-timeline');
const startDate = dataTest('activity-info-start-date');
const durationTime = dataTest('activity-info-duration');
const sets = dataTest('activity-info-sets');
const toFailurePercent = dataTest('activity-info-to-failure-percent');
const restPercent = dataTest('activity-info-rest-percent');
const muscleStatistics = dataTest('activity-info-muscle-statistics');
const exercise = dataTest('activity-info-exercise-element');
const startActivity = dataTest('activity-info-start');
const deleteActivity = dataTest('activity-info-delete');
const copyActivityToClipboard = dataTest('activity-info-copy-to-clipboard');
const modal = dataTest('activity-info-modal');
const goBackButton = dataTest('activity-info-go-back-button');

const id = '123';
const start = new Date('01-01-2025');
const end = new Date('01-02-2025');
const exercises = EXERCISES_ALL_DONE_FIXTURE;
const isPopup = false;

let wrapper: VueWrapper<InstanceType<typeof ActivityInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityInfo, { id, start, end, exercises, isPopup }, { FormButtonsLayout });
});

enableAutoUnmount(afterEach);

describe('ActivityInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityInfo)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('info is scrollable in popup', async () => {
    expect(wrapper.find(activityInfo).attributes('data-scrollable')).toBe(isPopup.toString());

    await wrapper.setProps({ isPopup: true });

    expect(wrapper.find(activityInfo).attributes('data-scrollable')).toBe(true.toString());
  });

  it('shows timeline only when all exercises is done', async () => {
    expect(wrapper.find(timeline).exists()).toBe(true);

    await wrapper.setProps({ exercises: EXERCISES_DONE_FIXTURE });

    expect(wrapper.find(timeline).exists()).toBe(false);
  });

  it('shows start and duration time', async () => {
    expect(wrapper.find(startDate).text()).toBe(formatDate(start, 'ru'));
    expect(wrapper.find(durationTime).text()).toBe(subtractDates(end, start, 'ru'));
  });

  it('shows sets, to failure and rest percents', async () => {
    expect(wrapper.find(sets).text()).toBe(exercises.length.toString());
    expect(wrapper.find(toFailurePercent).text()).toBe(getToFailurePercent(exercises));
    expect(wrapper.find(restPercent).text()).toBe(getRestPercent(exercises, 'ru', start, end));
  });

  it('gets and sets data to muscle statistics table', async () => {
    expect(spyGetMuscles).toBeCalledTimes(1);

    const statistics = generateMuscleStatistics(exercises, MUSCLES_FIXTURE, 'ru');

    expect(wrapper.findComponent<typeof MuscleStatistics>(muscleStatistics).props('statistics')).toStrictEqual(
      statistics
    );
  });

  it('shows exercises', async () => {
    expect(wrapper.findAll(exercise).length).toBe(exercises.length);
    expect(wrapper.findComponent<typeof ExerciseElement>(exercise).props('exercise')).toStrictEqual(exercises[0]);
  });

  it('starts activity in popup', async () => {
    expect(wrapper.find(startActivity).exists()).toBe(false);

    setAuth(true);
    await wrapper.setProps({ isPopup: true, start: new Date('01-01-3000') });

    expect(wrapper.find(startActivity).exists()).toBe(true);

    await wrapper.find(startActivity).trigger('click');

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(`${URL_ACTIVITY_EDIT}/${id}`);
  });

  it('deletes activity in popup', async () => {
    expect(spyDeleteActivity).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    expect(wrapper.emitted()).not.toHaveProperty('delete');

    expect(wrapper.find(deleteActivity).exists()).toBe(true);

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');

    await wrapper.find(deleteActivity).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof UiModal>(modal).vm.$emit('confirm');

    expect(spyDeleteActivity).toBeCalledTimes(1);
    expect(spyDeleteActivity).toBeCalledWith(id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(wrapper.emitted('delete')).toHaveLength(1);
  });

  it('copies activity to clipboard', async () => {
    expect(spyCopyToClipboard).toBeCalledTimes(0);

    await wrapper.find(copyActivityToClipboard).trigger('click');

    expect(spyCopyToClipboard).toBeCalledTimes(1);
  });

  it('handle go back button click', async () => {
    await wrapper.find(goBackButton).trigger('click');

    expect(spyRouterGo).toBeCalledTimes(1);
    expect(spyRouterGo).toBeCalledWith(-1);
  });
});
