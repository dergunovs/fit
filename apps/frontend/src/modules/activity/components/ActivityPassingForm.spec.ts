import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDateTime, dataTest } from 'mhz-helpers';

import ActivityPassingForm from './ActivityPassingForm.vue';
import ExercisePassingList from '@/exercise/components/ExercisePassingList.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE_2 } from '@/activity/fixtures';

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

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercises', async () => {
    expect(wrapper.findComponent<typeof ExercisePassingList>(exerciseList).vm.$props.exercises).toStrictEqual(
      activity.exercises
    );

    const activityWithoutExercises = { ...ACTIVITY_FIXTURE_2, exercises: [] };

    await wrapper.setProps({ activity: activityWithoutExercises });

    expect(wrapper.find(exerciseList).exists()).toBe(false);
  });

  it('shows start and update time', async () => {
    expect(wrapper.find(activityStart).text()).toBe(formatDateTime(activity.dateCreated, 'ru'));
    expect(wrapper.find(activityUpdated).text()).toBe(formatDateTime(activity.dateUpdated, 'ru'));

    const activityWithoutDate = { ...ACTIVITY_FIXTURE_2, dateUpdated: undefined };

    await wrapper.setProps({ activity: activityWithoutDate });

    expect(wrapper.find(activityUpdated).exists()).toBe(false);
  });

  it('finishes activity early', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('done');
    expect(wrapper.emitted()).not.toHaveProperty('exit');

    expect(wrapper.find(activityFinish).attributes('isdisabled')).toBe(activity.isDone.toString());

    await wrapper.find(activityFinish).trigger('click');

    expect(wrapper.emitted('done')).toHaveLength(1);
    expect(wrapper.emitted()['done'][0]).toStrictEqual([true]);

    expect(wrapper.emitted('exit')).toHaveLength(1);
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
