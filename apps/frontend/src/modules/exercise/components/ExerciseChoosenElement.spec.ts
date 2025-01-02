import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ExerciseChoosenElement from './ExerciseChoosenElement.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { EXERCISE_CHOOSEN_FIXTURE } from '@/exercise/fixtures';

const exerciseTitle = dataTest('exercise-title');
const exerciseDelete = dataTest('exercise-delete');

const index = 1;

let wrapper: VueWrapper<InstanceType<typeof ExerciseChoosenElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChoosenElement, { exercise: EXERCISE_CHOOSEN_FIXTURE, index });
});

enableAutoUnmount(afterEach);

describe('ExerciseChoosenElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChoosenElement)).toBeTruthy();
  });

  it('shows title', async () => {
    expect(wrapper.find(exerciseTitle).text()).toBe(
      `${index}. ${EXERCISE_CHOOSEN_FIXTURE.exercise?.title} x${EXERCISE_CHOOSEN_FIXTURE.repeats}`
    );
  });

  it('emits delete choosen exercise', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    await wrapper.find(exerciseDelete).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([EXERCISE_CHOOSEN_FIXTURE._id]);
  });
});
