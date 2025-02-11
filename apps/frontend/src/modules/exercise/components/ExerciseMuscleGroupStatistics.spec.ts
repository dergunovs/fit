import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseMuscleGroupStatistics from './ExerciseMuscleGroupStatistics.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { generateMuscleGroupStatistics } from '@/exercise/helpers';

const exerciseTableRow = dataTest('exercise-muscle-group-row');
const exerciseTitle = dataTest('exercise-muscle-group-title');
const exerciseSets = dataTest('exercise-muscle-group-sets');
const exerciseRepeats = dataTest('exercise-muscle-group-repeats');

let wrapper: VueWrapper<InstanceType<typeof ExerciseMuscleGroupStatistics>>;

const exercises = EXERCISES_DONE_FIXTURE;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseMuscleGroupStatistics, { exercises });
});

enableAutoUnmount(afterEach);

describe('ExerciseMuscleGroupStatistics', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseMuscleGroupStatistics)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercises in table', async () => {
    expect(wrapper.findAll(exerciseTableRow).length).toBe(generateMuscleGroupStatistics(exercises).length);

    expect(wrapper.find(exerciseTitle).text()).toBe(generateMuscleGroupStatistics(exercises)[0].title);
    expect(wrapper.find(exerciseSets).text()).toBe(generateMuscleGroupStatistics(exercises)[0].sets.toString());
    expect(wrapper.find(exerciseRepeats).text()).toBe(generateMuscleGroupStatistics(exercises)[0].repeats.toString());
  });
});
