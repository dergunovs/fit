import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { EXERCISE_MUSCLE_GROUPS } from 'fitness-tracker-contracts';

import ExerciseChooseList from './ExerciseChooseList.vue';
import ExerciseChooseElement from './ExerciseChooseElement.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';

const exerciseMuscleGroup = dataTest('exercise-muscle-group');
const exerciseMuscleGroupTitle = dataTest('exercise-muscle-group-title');
const exerciseMuscleGroupSpoiler = dataTest('exercise-muscle-group-spoiler');
const exerciseChooseElement = dataTest('exercise-choose-element');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChooseList, {
    props: { exercises: EXERCISES_FIXTURE },
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseChooseList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChooseList)).toBeTruthy();
  });

  it('shows muscle group buttons', async () => {
    expect(wrapper.findAll(exerciseMuscleGroup).length).toBe(EXERCISE_MUSCLE_GROUPS.length + 1);
  });

  it('shows exercise spoilers', async () => {
    expect(wrapper.findAll(exerciseMuscleGroupSpoiler).length).toBe(EXERCISES_FIXTURE.length);
    expect(wrapper.find(exerciseMuscleGroupSpoiler).attributes('title')).toBe(EXERCISES_FIXTURE[0].title);
  });

  it('shows exercises to choose', async () => {
    expect(wrapper.findAll(exerciseChooseElement).length).toBe(EXERCISES_FIXTURE.length);
    expect(wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).vm.$props.exercise).toStrictEqual(
      EXERCISES_FIXTURE[0]
    );
  });

  it('filters exercises to choose by title', async () => {
    const titleToFilter = EXERCISES_FIXTURE[0].title;

    await wrapper.findComponent(exerciseMuscleGroupTitle).setValue(titleToFilter);

    await nextTick();

    const filteredExercises = EXERCISES_FIXTURE.filter((exercise) => exercise.title.includes(titleToFilter));

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('filters exercises to choose by muscle group', async () => {
    const muscleGroupToFilter = EXERCISE_MUSCLE_GROUPS[0];

    await wrapper.findAll(exerciseMuscleGroup)[2].trigger('click');

    const filteredExercises = EXERCISES_FIXTURE.filter((exercise) =>
      exercise.muscleGroups?.some((group) => group._id === muscleGroupToFilter._id)
    );

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('emits choosen exercise', async () => {
    wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).vm.$emit('add', EXERCISES_FIXTURE[0]);

    expect(wrapper.emitted('choose')).toHaveLength(1);
    expect(wrapper.emitted()['choose'][0]).toStrictEqual([EXERCISES_FIXTURE[0]]);
  });
});
