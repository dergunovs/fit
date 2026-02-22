import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDate, subtractDates, setAuth, dataTest, deleteTempId } from 'mhz-helpers';
import { UiModal } from 'mhz-ui';
import { API_ACTIVITY, API_ACTIVITY_CALENDAR } from 'fitness-tracker-contracts';

import ActivityInfo from './ActivityInfo.vue';
import MuscleStatistics from '@/muscle/components/MuscleStatistics.vue';
import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import FormButtonsLayout from '@/common/components/FormButtonsLayout.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_ALL_DONE_FIXTURE, EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { generateActivityExercises, getRestPercent, getToFailurePercent } from '@/activity/helpers';
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
const exerciseList = dataTest('activity-info-exercise-list');
const startActivity = dataTest('activity-info-start');
const deleteActivity = dataTest('activity-info-delete');
const copyActivityToClipboard = dataTest('activity-info-copy-to-clipboard');
const modal = dataTest('activity-info-modal');
const createTemplateButton = dataTest('activity-info-create-template');
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

  it('shows timeline only in popup when all exercises is done', async () => {
    expect(wrapper.find(timeline).exists()).toBe(false);

    await wrapper.setProps({ isPopup: true });

    expect(wrapper.find(timeline).exists()).toBe(true);

    await wrapper.setProps({ isPopup: true, exercises: EXERCISES_DONE_FIXTURE });

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
    expect(spyGetMuscles).toHaveBeenCalledTimes(1);

    const statistics = generateMuscleStatistics(exercises, MUSCLES_FIXTURE, 'ru');

    expect(wrapper.findComponent<typeof MuscleStatistics>(muscleStatistics).props('statistics')).toStrictEqual(
      statistics
    );
  });

  it('passes props to exercise list', async () => {
    expect(wrapper.findComponent<typeof ExerciseElementList>(exerciseList).props('exercises')).toStrictEqual(exercises);
    expect(wrapper.findComponent<typeof ExerciseElementList>(exerciseList).props('isFutureActivity')).toStrictEqual(
      start > new Date()
    );
  });

  it('starts activity in popup', async () => {
    expect(wrapper.find(startActivity).exists()).toBe(false);

    setAuth(true);
    await wrapper.setProps({ isPopup: true, start: new Date('01-01-3000') });

    expect(wrapper.find(startActivity).exists()).toBe(true);

    await wrapper.find(startActivity).trigger('click');

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
    expect(spyRouterPush).toHaveBeenCalledWith(`${URL_ACTIVITY_EDIT}/${id}`);
  });

  it('deletes activity in popup', async () => {
    expect(spyDeleteActivity).toHaveBeenCalledTimes(0);
    expect(spyRemoveQueries).toHaveBeenCalledTimes(0);
    expect(spyRefetchQueries).toHaveBeenCalledTimes(0);
    expect(spyToastSuccess).toHaveBeenCalledTimes(0);

    expect(wrapper.emitted()).not.toHaveProperty('delete');

    expect(wrapper.find(deleteActivity).exists()).toBe(true);

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');

    await wrapper.find(deleteActivity).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof UiModal>(modal).vm.$emit('confirm');

    expect(spyDeleteActivity).toHaveBeenCalledTimes(1);
    expect(spyDeleteActivity).toHaveBeenCalledWith(id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toHaveBeenCalledTimes(1);
    expect(spyRemoveQueries).toHaveBeenCalledWith({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });

    expect(spyRefetchQueries).toHaveBeenCalledTimes(1);
    expect(spyRefetchQueries).toHaveBeenCalledWith({ queryKey: [API_ACTIVITY, API_ACTIVITY_CALENDAR] });

    expect(spyToastSuccess).toHaveBeenCalledTimes(1);

    expect(wrapper.emitted('delete')).toHaveLength(1);
  });

  it('copies activity to clipboard', async () => {
    expect(spyCopyToClipboard).toHaveBeenCalledTimes(0);

    await wrapper.find(copyActivityToClipboard).trigger('click');

    expect(spyCopyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('handle go back button click', async () => {
    await wrapper.find(goBackButton).trigger('click');

    expect(spyRouterGo).toHaveBeenCalledTimes(1);
    expect(spyRouterGo).toHaveBeenCalledWith(-1);
  });

  it('creates user template when button is clicked', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('createTemplate');
    expect(wrapper.find(createTemplateButton).exists()).toBe(false);

    setAuth(true);
    await wrapper.setProps({ isPopup: true });

    expect(wrapper.find(createTemplateButton).exists()).toBe(true);

    await wrapper.find(createTemplateButton).trigger('click');

    const generatedExercises = generateActivityExercises(exercises);

    const template = {
      title: formatDate(start, 'ru'),
      exercises: deleteTempId(generatedExercises),
    };

    expect(wrapper.emitted('createTemplate')).toHaveLength(1);
    expect(wrapper.emitted()['createTemplate'][0]).toStrictEqual([template]);
  });
});
