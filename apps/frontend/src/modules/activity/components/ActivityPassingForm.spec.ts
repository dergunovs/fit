import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY, API_ACTIVITY_CHART, API_ACTIVITY_STATISTICS } from 'fitness-tracker-contracts';
import { formatDateTime, dataTest, wait } from 'mhz-helpers';

import ActivityPassingForm from './ActivityPassingForm.vue';
import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';
import ExerciseElementPassing from '@/exercise/components/ExerciseElementPassing.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE_2 } from '@/activity/fixtures';
import { mockOnSuccess, spyUpdateActivity } from '@/activity/mocks';
import { spyRefetchQueries, spyRouterPush, spyToastSuccess } from '@/common/mocks';
import { URL_HOME } from '@/common/constants';
import { updateExercisesIndex } from '@/exercise/helpers';

const restTimer = dataTest('activity-passing-form-rest-timer');
const exerciseList = dataTest('activity-passing-form-exercise-list');
const exerciseElement = dataTest('activity-passing-form-exercise');
const activityStart = dataTest('activity-start');
const activityFinish = dataTest('activity-finish');

const exerciseElementListStub = {
  name: 'ExerciseElementList',
  template: `
          <div data-test="activity-passing-form-exercises">
            <div v-for="(exercise, index) in exercises" :key="exercise._id">
              <slot :exercise="exercise" :index="index"></slot>
            </div>
          </div>
        `,
  props: ['exercises', 'isPassing'],
};

let wrapper: VueWrapper<InstanceType<typeof ActivityPassingForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(
    ActivityPassingForm,
    { activity: ACTIVITY_FIXTURE_2 },
    { ExerciseElementList: exerciseElementListStub }
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

  it('shows start time', async () => {
    expect(wrapper.find(activityStart).text()).toBe(formatDateTime(ACTIVITY_FIXTURE_2.dateCreated, 'ru'));
  });

  it('shows rest timer', async () => {
    expect(wrapper.find(restTimer).exists()).toBe(true);
  });

  it('finishes activity early', async () => {
    expect(spyUpdateActivity).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    expect(wrapper.find(activityFinish).attributes('isdisabled')).toBe(ACTIVITY_FIXTURE_2.isDone.toString());

    await wrapper.find(activityFinish).trigger('click');

    expect(spyUpdateActivity).toBeCalledTimes(1);
    expect(spyUpdateActivity).toBeCalledWith({ ...ACTIVITY_FIXTURE_2, isDone: true });

    await mockOnSuccess.update?.();

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(wrapper.find(activityFinish).exists()).toBe(false);

    await wait(1001);

    expect(spyRefetchQueries).toBeCalledTimes(3);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_CHART] });

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_HOME);
  });

  it('stops exercise', async () => {
    const currentExerciseIndex = ACTIVITY_FIXTURE_2.exercises.filter((exercise) => exercise.isDone).length;
    const exercise = ACTIVITY_FIXTURE_2.exercises[currentExerciseIndex];
    const fixedDate = new Date();

    vi.setSystemTime(fixedDate);

    expect(wrapper.find(restTimer).exists()).toBe(true);

    wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).vm.$emit('start', exercise._id);

    await nextTick();

    expect(wrapper.find(restTimer).exists()).toBe(false);

    const exerciseDone = { _id: exercise._id };

    wrapper.findComponent<typeof ExerciseElementPassing>(exerciseElement).vm.$emit('stop', exerciseDone, 60);

    await nextTick();

    expect(spyUpdateActivity).toBeCalledTimes(1);

    const expectedExercises = ACTIVITY_FIXTURE_2.exercises.map((e) =>
      e._id === exercise._id ? { ...e, isDone: true, duration: 60, dateUpdated: fixedDate } : e
    );

    expect(spyUpdateActivity).toBeCalledWith({
      ...ACTIVITY_FIXTURE_2,
      exercises: expectedExercises,
      dateUpdated: fixedDate,
      isDone: true,
    });

    vi.useRealTimers();
  });

  it('handles deleteExercise and updateIndex events correctly', async () => {
    const initialExercises = ACTIVITY_FIXTURE_2.exercises;
    const exerciseToDelete = initialExercises[0]._id;
    const newIndex = 1;

    expect(wrapper.findComponent<typeof ExerciseElementList>(exerciseList).props('exercises')).toEqual(
      initialExercises
    );

    wrapper.findComponent<typeof ExerciseElementList>(exerciseList).vm.$emit('delete', exerciseToDelete);

    await nextTick();

    const afterDeleteExercises = initialExercises.filter((e) => e._id !== exerciseToDelete);

    expect(wrapper.findComponent<typeof ExerciseElementList>(exerciseList).props('exercises')).toEqual(
      afterDeleteExercises
    );

    wrapper.findComponent<typeof ExerciseElementList>(exerciseList).vm.$emit('setIndex', newIndex);

    await nextTick();

    const expectedAfterIndexUpdate = updateExercisesIndex(afterDeleteExercises, newIndex);

    expect(wrapper.findComponent<typeof ExerciseElementList>(exerciseList).props('exercises')).toEqual(
      expectedAfterIndexUpdate
    );
  });
});
