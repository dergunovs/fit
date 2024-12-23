import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseChoosenList from './ExerciseChoosenList.vue';
import ExerciseChoosenElement from './ExerciseChoosenElement.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE } from '@/exercise/fixtures';

const exerciseChoosen = dataTest('exercise-choosen');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChoosenList, {
    props: { choosenExercises: EXERCISES_CHOOSEN_FIXTURE },
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseChoosenList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChoosenList)).toBeTruthy();
  });

  it('shows choosen exercises', async () => {
    expect(wrapper.findAll(exerciseChoosen).length).toBe(EXERCISES_CHOOSEN_FIXTURE.length);
    expect(wrapper.findComponent<typeof ExerciseChoosenElement>(exerciseChoosen).vm.$props.exercise).toStrictEqual(
      EXERCISES_CHOOSEN_FIXTURE[0]
    );
  });

  it('emits delete choosen exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    wrapper
      .findComponent<typeof ExerciseChoosenElement>(exerciseChoosen)
      .vm.$emit('delete', EXERCISES_CHOOSEN_FIXTURE[0]._id);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([EXERCISES_CHOOSEN_FIXTURE[0]._id]);
  });
});
