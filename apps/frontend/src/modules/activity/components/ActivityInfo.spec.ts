import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDate, subtractDates, setAuth } from 'mhz-helpers';

import ActivityInfo from './ActivityInfo.vue';
import ActivityTimeline from './ActivityTimeline.vue';
import ExerciseMuscleGroupStatistics from '@/exercise/components/ExerciseMuscleGroupStatistics.vue';
import ExerciseTitle from '@/exercise/components/ExerciseTitle.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { getRestPercent, getToFailurePercent } from '@/activity/helpers';
import { spyCopyActivityToClipboard } from '@/activity/mocks';
import { spyRouterPush } from '@/common/mocks';
import { URL_ACTIVITY_CREATE } from '@/activity/constants';

const activityInfo = dataTest('activity-info');
const timeline = dataTest('activity-timeline');
const startTime = dataTest('activity-info-start');
const durationTime = dataTest('activity-info-duration');
const sets = dataTest('activity-info-sets');
const toFailurePercent = dataTest('activity-info-to-failure-percent');
const restPercent = dataTest('activity-info-rest-percent');
const copy = dataTest('activity-info-copy');
const muscleGroups = dataTest('activity-info-muscle-groups');
const exercise = dataTest('activity-info-exercise');
const generateCopy = dataTest('activity-info-generate-copy');

const id = '123';
const start = '01-01-2025';
const end = '01-02-2025';
const exercises = EXERCISES_DONE_FIXTURE;
const isPopup = false;

let wrapper: VueWrapper<InstanceType<typeof ActivityInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityInfo, { id, start, end, exercises, isPopup });
});

enableAutoUnmount(afterEach);

describe('ActivityInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityInfo)).toBeTruthy();
  });

  it('info is scrollable in popup', async () => {
    expect(wrapper.find(activityInfo).attributes('data-scrollable')).toBe(isPopup.toString());

    await wrapper.setProps({ isPopup: true });

    expect(wrapper.find(activityInfo).attributes('data-scrollable')).toBe(true.toString());
  });

  it('shows timeline in popup', async () => {
    expect(wrapper.find(timeline).exists()).toBe(false);

    await wrapper.setProps({ isPopup: true });

    expect(wrapper.findComponent<typeof ActivityTimeline>(timeline).vm.$props.exercises).toStrictEqual(exercises);
    expect(wrapper.findComponent<typeof ActivityTimeline>(timeline).vm.$props.start).toStrictEqual(start);
  });

  it('shows start and duration time', async () => {
    expect(wrapper.find(startTime).text()).toBe(formatDate(start, 'ru'));
    expect(wrapper.find(durationTime).text()).toBe(subtractDates(end, start));
  });

  it('shows sets, to failure and rest percents', async () => {
    expect(wrapper.find(sets).text()).toBe(exercises.length.toString());
    expect(wrapper.find(toFailurePercent).text()).toBe(getToFailurePercent(exercises));
    expect(wrapper.find(restPercent).text()).toBe(getRestPercent(exercises, start, end));
  });

  it('copies activity info to clipboard', async () => {
    expect(spyCopyActivityToClipboard).toBeCalledTimes(0);

    await wrapper.find(copy).trigger('click');

    expect(spyCopyActivityToClipboard).toBeCalledTimes(1);
    expect(spyCopyActivityToClipboard).toBeCalledWith(exercises, start, end);
  });

  it('sets data to muscle group statistics table', async () => {
    expect(wrapper.findComponent<typeof ExerciseMuscleGroupStatistics>(muscleGroups).vm.$props.exercises).toStrictEqual(
      exercises
    );
  });

  it('shows exercises', async () => {
    expect(wrapper.findAll(exercise).length).toBe(exercises.length);
    expect(wrapper.findAllComponents<typeof ExerciseTitle>(exercise)[0].vm.$props.exercise).toStrictEqual(exercises[0]);
  });

  it('generates same activity in popup mode', async () => {
    expect(wrapper.find(generateCopy).exists()).toBe(isPopup);
    expect(spyRouterPush).toBeCalledTimes(0);

    setAuth(true);
    await wrapper.setProps({ isPopup: true });

    expect(wrapper.find(generateCopy).exists()).toBe(true);

    await wrapper.find(generateCopy).trigger('click');

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(`${URL_ACTIVITY_CREATE}?copy=${id}`);
  });
});
