import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExercisePassingList from './ExercisePassingList.vue';
import ExercisePassingElement from './ExercisePassingElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';

const exercise = dataTest('exercise-element');

let wrapper: VueWrapper<InstanceType<typeof ExercisePassingList>>;

const exercises = EXERCISES_DONE_FIXTURE;
const activeExerciseId = '9999';

beforeEach(() => {
  wrapper = wrapperFactory(ExercisePassingList, { exercises, activeExerciseId });
});

enableAutoUnmount(afterEach);

describe('ExercisePassingList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExercisePassingList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercise elements and sets props', async () => {
    expect(wrapper.findAll(exercise).length).toBe(exercises.length);

    expect(wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$props.exercise).toStrictEqual(
      exercises[0]
    );

    expect(wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$props.activeExerciseId).toStrictEqual(
      activeExerciseId
    );

    expect(wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$props.isCurrentExercise).toStrictEqual(
      exercises.filter((ex) => ex.isDone).length === 0
    );

    expect(wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$props.index).toStrictEqual(0 + 1);

    expect(wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$props.exercisesCount).toStrictEqual(
      exercises.length
    );
  });

  it('emits data by exercise element events', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('start');
    expect(wrapper.emitted()).not.toHaveProperty('stop');

    const id = EXERCISES_DONE_FIXTURE[0]._id?.toString();

    wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$emit('start', id);

    expect(wrapper.emitted('start')).toHaveLength(1);
    expect(wrapper.emitted()['start'][0]).toStrictEqual([id]);

    wrapper.findComponent<typeof ExercisePassingElement>(exercise).vm.$emit('stop', EXERCISES_DONE_FIXTURE[0]);

    expect(wrapper.emitted('stop')).toHaveLength(1);
    expect(wrapper.emitted()['stop'][0]).toStrictEqual([EXERCISES_DONE_FIXTURE[0]]);
  });
});
