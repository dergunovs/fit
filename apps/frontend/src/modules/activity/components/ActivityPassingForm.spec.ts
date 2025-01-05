import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY } from 'fitness-tracker-contracts';
import { formatDateTime, dataTest, wait } from 'mhz-helpers';

import ActivityPassingForm from './ActivityPassingForm.vue';
import ExercisePassingList from '@/exercise/components/ExercisePassingList.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE_2 } from '@/activity/fixtures';
import { mockOnSuccess, spyUpdateActivity } from '@/activity/mocks';
import { spyRefetchQueries, spyRouterPush, spyToastSuccess } from '@/common/mocks';
import { URL_HOME } from '@/common/constants';

const exerciseList = dataTest('exercise-passing-list');
const activityStart = dataTest('activity-start');
const activityUpdated = dataTest('activity-updated');
const activityFinish = dataTest('activity-finish');

const activity = ACTIVITY_FIXTURE_2;

let wrapper: VueWrapper<InstanceType<typeof ActivityPassingForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityPassingForm, { activity });
});

enableAutoUnmount(afterEach);

describe('ActivityPassingForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityPassingForm)).toBeTruthy();
  });

  it('shows exercises', async () => {
    expect(wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$props.exercises).toStrictEqual(
      activity.exercises
    );
  });

  it('shows start and update time', async () => {
    expect(wrapper.find(activityStart).text()).toBe(formatDateTime(activity.dateCreated, 'ru'));
    expect(wrapper.find(activityUpdated).text()).toBe(formatDateTime(activity.dateUpdated, 'ru'));
  });

  it('finishes activity early', async () => {
    expect(spyUpdateActivity).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    expect(wrapper.find(activityFinish).attributes('isdisabled')).toBe(activity.isDone.toString());

    await wrapper.find(activityFinish).trigger('click');

    expect(spyUpdateActivity).toBeCalledTimes(1);
    expect(spyUpdateActivity).toBeCalledWith({ ...activity, isDone: true });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(0);

    await wait(1001);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });

  it('starts and stops exercise', async () => {
    expect(wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$props.activeExerciseId).toStrictEqual(
      undefined
    );

    wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$emit('start', activity.exercises[0]._id);

    await nextTick();

    expect(wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$props.activeExerciseId).toStrictEqual(
      activity.exercises[0]._id
    );

    wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$emit('stop', activity.exercises[0]);

    await nextTick();

    expect(wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$props.activeExerciseId).toStrictEqual(
      undefined
    );
  });
});
