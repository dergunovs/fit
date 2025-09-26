import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDateTime, dataTest } from 'mhz-helpers';

import ActivityPassingForm from './ActivityPassingForm.vue';
import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import ExerciseElementPassing from '@/exercise/components/ExerciseElementPassing.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE_2 } from '@/activity/fixtures';

const restTimer = dataTest('activity-passing-form-rest-timer');
const exerciseElement = dataTest('activity-passing-form-exercise');
const activityStart = dataTest('activity-start');
const activityFinish = dataTest('activity-finish');

const activity = ACTIVITY_FIXTURE_2;
const exercise = activity.exercises[0];
const duration = 40;
const isToFailure = false;
const repeats = 12;

let wrapper: VueWrapper<InstanceType<typeof ActivityPassingForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(
    ActivityPassingForm,
    { activity },
    {
      ExerciseElementList: {
        name: 'ExerciseElementList',
        template: `
          <div data-test="activity-passing-form-exercises">
            <div v-for="(exercise, index) in exercises" :key="exercise._id">
              <slot :exercise="exercise" :index="index"></slot>
            </div>
          </div>
        `,
        props: ['exercises', 'isPassing'],
      },
    }
  );
});

enableAutoUnmount(afterEach);

describe('ActivityPassingForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityPassingForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows start  time', async () => {
    expect(wrapper.find(activityStart).text()).toBe(formatDateTime(activity.dateCreated, 'ru'));
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
    expect(wrapper.find(restTimer).exists()).toStrictEqual(true);

    expect(wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).props('isActive')).toStrictEqual(
      false
    );

    wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).vm.$emit('start', activity.exercises[1]._id);

    await nextTick();

    expect(wrapper.find(restTimer).exists()).toStrictEqual(false);

    expect(wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).props('isActive')).toStrictEqual(true);

    expect(wrapper.emitted()).not.toHaveProperty('updateExercises');
    expect(wrapper.emitted()).not.toHaveProperty('setDateUpdated');

    wrapper
      .findComponent<typeof ExerciseElementList>(exerciseElement)
      .vm.$emit('stop', exercise, duration, isToFailure, repeats);

    await nextTick();

    expect(wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).props('isActive')).toStrictEqual(
      false
    );

    expect(wrapper.emitted('updateExercises')).toHaveLength(1);
    expect(wrapper.emitted('setDateUpdated')).toHaveLength(1);
  });
});
