import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseElementList from './ExerciseElementList.vue';
import ExerciseElement from './ExerciseElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_CHOOSEN_FIXTURE } from '@/exercise/fixtures';

const exercise = dataTest('exercise-element');

let wrapper: VueWrapper<InstanceType<typeof ExerciseElementList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseElementList, { exercises: EXERCISES_CHOOSEN_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseElementList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseElementList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows choosen exercises', async () => {
    expect(wrapper.findAll(exercise).length).toBe(EXERCISES_CHOOSEN_FIXTURE.length);
    expect(wrapper.findComponent<typeof ExerciseElement>(exercise).props('exercise')).toStrictEqual(
      EXERCISES_CHOOSEN_FIXTURE[0]
    );
  });

  it('emits choosen exercise events', async () => {
    const INDEX = 1;
    const ID = EXERCISES_CHOOSEN_FIXTURE[0]._id;
    const REPEATS = 8;
    const WEIGHT = 20;

    expect(wrapper.emitted()).not.toHaveProperty('createSet');
    expect(wrapper.emitted()).not.toHaveProperty('delete');
    expect(wrapper.emitted()).not.toHaveProperty('setIndex');
    expect(wrapper.emitted()).not.toHaveProperty('setRepeats');
    expect(wrapper.emitted()).not.toHaveProperty('setWeight');

    wrapper.findComponent<typeof ExerciseElement>(exercise).vm.$emit('createSet');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);

    wrapper.findComponent<typeof ExerciseElement>(exercise).vm.$emit('delete', ID);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([ID]);

    wrapper.findComponent<typeof ExerciseElement>(exercise).vm.$emit('setIndex', INDEX);

    expect(wrapper.emitted('setIndex')).toHaveLength(1);
    expect(wrapper.emitted()['setIndex'][0]).toStrictEqual([INDEX]);

    wrapper.findComponent<typeof ExerciseElement>(exercise).vm.$emit('setRepeats', REPEATS, ID);

    expect(wrapper.emitted('setRepeats')).toHaveLength(1);
    expect(wrapper.emitted()['setRepeats'][0]).toStrictEqual([REPEATS, ID]);

    wrapper.findComponent<typeof ExerciseElement>(exercise).vm.$emit('setWeight', WEIGHT, ID);

    expect(wrapper.emitted('setWeight')).toHaveLength(1);
    expect(wrapper.emitted()['setWeight'][0]).toStrictEqual([WEIGHT, ID]);
  });
});
