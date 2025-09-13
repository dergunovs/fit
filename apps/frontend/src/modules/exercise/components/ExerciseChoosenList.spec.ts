import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseChoosenList from './ExerciseChoosenList.vue';
import ExerciseElement from './ExerciseElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE } from '@/exercise/fixtures';

const exerciseChoosen = dataTest('exercise-choosen-element');

let wrapper: VueWrapper<InstanceType<typeof ExerciseChoosenList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChoosenList, { choosenExercises: EXERCISES_CHOOSEN_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseChoosenList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChoosenList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows choosen exercises', async () => {
    expect(wrapper.findAll(exerciseChoosen).length).toBe(EXERCISES_CHOOSEN_FIXTURE.length);
    expect(wrapper.findComponent<typeof ExerciseElement>(exerciseChoosen).props('exercise')).toStrictEqual(
      EXERCISES_CHOOSEN_FIXTURE[0]
    );
  });

  it('emits choosen exercise events', async () => {
    const INDEX = 1;

    expect(wrapper.emitted()).not.toHaveProperty('createSet');
    expect(wrapper.emitted()).not.toHaveProperty('delete');
    expect(wrapper.emitted()).not.toHaveProperty('setIndex');

    wrapper.findComponent<typeof ExerciseElement>(exerciseChoosen).vm.$emit('createSet');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);

    wrapper.findComponent<typeof ExerciseElement>(exerciseChoosen).vm.$emit('delete', EXERCISES_CHOOSEN_FIXTURE[0]._id);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([EXERCISES_CHOOSEN_FIXTURE[0]._id]);

    wrapper.findComponent<typeof ExerciseElement>(exerciseChoosen).vm.$emit('setIndex', INDEX);

    expect(wrapper.emitted('setIndex')).toHaveLength(1);
    expect(wrapper.emitted()['setIndex'][0]).toStrictEqual([INDEX]);
  });
});
