import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseChoosenButtons from './ExerciseChoosenButtons.vue';

import { wrapperFactory } from '@/common/test';

const indexDown = dataTest('exercise-choose-buttons-index-down');
const indexUp = dataTest('exercise-choose-buttons-index-up');
const createSet = dataTest('exercise-choose-buttons-create-set');
const repeats = dataTest('exercise-choose-buttons-repeats');
const weight = dataTest('exercise-choose-buttons-weight');
const deleteButton = dataTest('exercise-choose-buttons-delete');

const REPEATS = 4;
const INDEX = 2;
const WEIGHT = 16;

let wrapper: VueWrapper<InstanceType<typeof ExerciseChoosenButtons>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChoosenButtons, {
    repeats: REPEATS,
    isSetCreatable: true,
    index: INDEX,
    isLast: false,
    weight: WEIGHT,
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseChoosenButtons', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChoosenButtons)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('disables update index buttons if first or last index', async () => {
    expect(wrapper.find(indexDown).attributes('disabled')).toBe(undefined);
    expect(wrapper.find(indexUp).attributes('disabled')).toBe(undefined);

    await wrapper.setProps({ index: 0 });

    expect(wrapper.find(indexDown).attributes('disabled')).toBe('');
    expect(wrapper.find(indexUp).attributes('disabled')).toBe(undefined);

    await wrapper.setProps({ index: 1, isLast: true });

    expect(wrapper.find(indexDown).attributes('disabled')).toBe(undefined);
    expect(wrapper.find(indexUp).attributes('disabled')).toBe('');

    await wrapper.setProps({ index: 0, isLast: true });

    expect(wrapper.find(indexDown).attributes('disabled')).toBe('');
    expect(wrapper.find(indexUp).attributes('disabled')).toBe('');
  });

  it('hides create set button if set is not creatable', async () => {
    expect(wrapper.find(createSet).exists()).toBe(true);

    await wrapper.setProps({ isSetCreatable: false });

    expect(wrapper.find(createSet).exists()).toBe(false);
  });

  it('hides weight info if no weight', async () => {
    expect(wrapper.find(weight).exists()).toBe(true);

    await wrapper.setProps({ weight: undefined });

    expect(wrapper.find(weight).exists()).toBe(false);
  });

  it('shows repeats and weight', async () => {
    expect(wrapper.find(repeats).text()).toBe(`x${REPEATS}`);
    expect(wrapper.find(weight).text()).toBe(`${WEIGHT} кг`);
  });

  it('emits updated index', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('setIndex');

    await wrapper.find(indexDown).trigger('click');

    expect(wrapper.emitted('setIndex')).toHaveLength(1);
    expect(wrapper.emitted()['setIndex'][0]).toStrictEqual([INDEX]);

    await wrapper.find(indexUp).trigger('click');

    expect(wrapper.emitted('setIndex')).toHaveLength(2);
    expect(wrapper.emitted()['setIndex'][1]).toStrictEqual([INDEX + 1]);
  });

  it('createSet', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('createSet');

    await wrapper.find(createSet).trigger('click');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);
  });

  it('emits delete', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    await wrapper.find(deleteButton).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([]);
  });
});
