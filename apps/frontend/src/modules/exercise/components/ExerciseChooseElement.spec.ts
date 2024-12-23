import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseChooseElement from './ExerciseChooseElement.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';
import { EXERCISE_REPEATS_DEFAULT, EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';
import { mockTempId } from '@/common/mocks';

const exerciseWeight = dataTest('exercise-weight');
const exerciseRepeats = dataTest('exercise-repeats');
const exerciseAdd1 = dataTest('exercise-add-1');
const exerciseAdd2 = dataTest('exercise-add-2');
const exerciseAdd3 = dataTest('exercise-add-3');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChooseElement, {
    props: { exercise: EXERCISE_FIXTURE },
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseChooseElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChooseElement)).toBeTruthy();
  });

  it('hides weight select if no weights options', async () => {
    expect(wrapper.find(exerciseWeight).exists()).toBe(true);

    await wrapper.setProps({ exercise: { ...EXERCISE_FIXTURE, weights: [] } });

    expect(wrapper.find(exerciseWeight).exists()).toBe(false);
  });

  it('sets weight options to select', async () => {
    expect(wrapper.find(exerciseWeight).attributes('options')).toBe(EXERCISE_FIXTURE.weights?.join().toString());
    expect(wrapper.find(exerciseWeight).attributes('modelvalue')).toBe(EXERCISE_FIXTURE.defaultWeight?.toString());
  });

  it('sets repeats options to select', async () => {
    expect(wrapper.find(exerciseRepeats).attributes('options')).toBe(EXERCISE_REPEATS_OPTIONS.join().toString());
    expect(wrapper.find(exerciseRepeats).attributes('modelvalue')).toBe(EXERCISE_REPEATS_DEFAULT.toString());
  });

  it('emits choosen exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('add');

    const choosenExercise = {
      _id: mockTempId,
      exercise: { _id: EXERCISE_FIXTURE._id, title: EXERCISE_FIXTURE.title },
      repeats: EXERCISE_REPEATS_DEFAULT,
      weight: EXERCISE_FIXTURE.defaultWeight,
    };

    await wrapper.find(exerciseAdd1).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted()['add'][0]).toEqual([choosenExercise]);

    await wrapper.find(exerciseAdd2).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1 + 2);
    expect(wrapper.emitted()['add'][1]).toEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][2]).toEqual([choosenExercise]);

    await wrapper.find(exerciseAdd3).trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1 + 2 + 3);
    expect(wrapper.emitted()['add'][3]).toEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][4]).toEqual([choosenExercise]);
    expect(wrapper.emitted()['add'][5]).toEqual([choosenExercise]);
  });
});
