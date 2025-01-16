import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { EXERCISE_MUSCLE_GROUPS } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import ExerciseChooseList from './ExerciseChooseList.vue';
import ExerciseChooseElement from './ExerciseChooseElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { filterExercisesByTitleAndMuscleGroup } from '@/exercise/helpers';

const exerciseMuscleGroup = dataTest('exercise-muscle-group');
const exerciseMuscleGroupTitle = dataTest('exercise-muscle-group-title');
const exerciseMuscleGroupSpoiler = dataTest('exercise-muscle-group-spoiler');
const exerciseChooseElement = dataTest('exercise-choose-element');

let wrapper: VueWrapper<InstanceType<typeof ExerciseChooseList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChooseList, { exercises: EXERCISES_FIXTURE });
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
    const filteredExercises = filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', '');

    expect(wrapper.findAll(exerciseMuscleGroupSpoiler).length).toBe(filteredExercises.length);
    expect(wrapper.find(exerciseMuscleGroupSpoiler).attributes('title')).toBe(filteredExercises[0].title);
  });

  it('shows exercises to choose', async () => {
    const filteredExercises = filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', '');

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
    expect(wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).vm.$props.exercise).toStrictEqual(
      filteredExercises[0]
    );
  });

  it('filters exercises to choose by title', async () => {
    const titleToFilter = EXERCISES_FIXTURE[0].title;

    const filteredExercises = filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, titleToFilter, '');

    await wrapper.findComponent(exerciseMuscleGroupTitle).setValue(titleToFilter);

    await nextTick();

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('filters exercises to choose by muscle group', async () => {
    const muscleGroupToFilter = EXERCISE_MUSCLE_GROUPS[0];

    const filteredExercises = filterExercisesByTitleAndMuscleGroup(EXERCISES_FIXTURE, '', muscleGroupToFilter);

    await wrapper.findAll(exerciseMuscleGroup)[2].trigger('click');

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('emits choosen exercise', async () => {
    wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).vm.$emit('add', EXERCISES_FIXTURE[0]);

    expect(wrapper.emitted('choose')).toHaveLength(1);
    expect(wrapper.emitted()['choose'][0]).toStrictEqual([EXERCISES_FIXTURE[0]]);
  });
});
