import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseChooseElement from './ExerciseChooseElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';
import { EXERCISE_REPEATS_DEFAULT, EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';
import { mockTempId } from '@/common/mocks';
import { USER_FIXTURE } from '@/user/fixtures';
import { getAvailableExerciseWeights, getDefaultExerciseWeight } from '@/exercise/helpers';

const exerciseRepeats = dataTest('exercise-repeats');
const exerciseWeight = dataTest('exercise-weight');
const exerciseAdd1 = dataTest('exercise-add-1');
const exerciseAdd2 = dataTest('exercise-add-2');
const exerciseAdd3 = dataTest('exercise-add-3');

const weights = getAvailableExerciseWeights(EXERCISE_FIXTURE, USER_FIXTURE);
const defaultWeight = getDefaultExerciseWeight(EXERCISE_FIXTURE, USER_FIXTURE, weights);

let wrapper: VueWrapper<InstanceType<typeof ExerciseChooseElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChooseElement, { exercise: EXERCISE_FIXTURE, user: USER_FIXTURE, weights });
});

enableAutoUnmount(afterEach);

describe('ExerciseChooseElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChooseElement)).toBeTruthy();
  });

  it('sets default repeat and repeats options', async () => {
    expect(wrapper.find(exerciseRepeats).attributes('options')).toBe(EXERCISE_REPEATS_OPTIONS.join().toString());
    expect(wrapper.find(exerciseRepeats).attributes('modelvalue')).toBe(EXERCISE_REPEATS_DEFAULT.toString());
  });

  it('sets default weight and weught options', async () => {
    expect(wrapper.find(exerciseWeight).attributes('modelvalue')).toBe(defaultWeight.toString());
  });

  it('emits choosen exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('add');

    const choosenExercise = {
      _id: mockTempId,
      exercise: {
        _id: EXERCISE_FIXTURE._id,
        title: EXERCISE_FIXTURE.title,
        isWeights: EXERCISE_FIXTURE.isWeights,
        isWeightsRequired: EXERCISE_FIXTURE.isWeightsRequired,
      },
      repeats: EXERCISE_REPEATS_DEFAULT,
      weight: defaultWeight,
    };

    await wrapper.find(exerciseAdd1).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted()['add'][0]).toStrictEqual([choosenExercise]);

    await wrapper.find(exerciseAdd2).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1 + 2);
    expect(wrapper.emitted()['add'][1]).toStrictEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][2]).toStrictEqual([choosenExercise]);

    await wrapper.find(exerciseAdd3).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1 + 2 + 3);
    expect(wrapper.emitted()['add'][3]).toStrictEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][4]).toStrictEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][5]).toStrictEqual([choosenExercise]);
  });
});
