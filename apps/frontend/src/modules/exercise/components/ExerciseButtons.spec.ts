import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, formatDuration } from 'mhz-helpers';

import ExerciseButtons from './ExerciseButtons.vue';

import { wrapperFactory } from '@/common/test';

const indexDown = dataTest('exercise-buttons-index-down');
const indexUp = dataTest('exercise-buttons-index-up');
const createSet = dataTest('exercise-buttons-create-set');
const repeats = dataTest('exercise-buttons-repeats');
const weight = dataTest('exercise-buttons-weight');
const notDone = dataTest('exercise-buttons-not-done');
const toFailure = dataTest('exercise-buttons-to-failure');
const duration = dataTest('exercise-buttons-duration');
const deleteButton = dataTest('exercise-buttons-delete');

const REPEATS = 4;
const INDEX = 2;
const WEIGHT = 16;
const DURATION = 40;

let wrapper: VueWrapper<InstanceType<typeof ExerciseButtons>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseButtons, {
    isEdit: true,
    isSetCreatable: true,
    isWeights: true,
    repeats: REPEATS,
    index: INDEX,
    weight: WEIGHT,
    duration: DURATION,
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseButtons', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseButtons)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('hides update index buttons if first or last index', async () => {
    expect(wrapper.find(indexDown).exists()).toBe(true);
    expect(wrapper.find(indexUp).exists()).toBe(true);

    await wrapper.setProps({ index: 0 });

    expect(wrapper.find(indexDown).exists()).toBe(false);
    expect(wrapper.find(indexUp).exists()).toBe(true);

    await wrapper.setProps({ index: 1, isLast: true });

    expect(wrapper.find(indexDown).exists()).toBe(true);
    expect(wrapper.find(indexUp).exists()).toBe(false);

    await wrapper.setProps({ index: 0, isLast: true });

    expect(wrapper.find(indexDown).exists()).toBe(false);
    expect(wrapper.find(indexUp).exists()).toBe(false);
  });

  it('hides create set button if set is not creatable', async () => {
    expect(wrapper.find(createSet).exists()).toBe(true);

    await wrapper.setProps({ isSetCreatable: false });

    expect(wrapper.find(createSet).exists()).toBe(false);
  });

  it('hides weight info if no weight', async () => {
    expect(wrapper.find(weight).exists()).toBe(true);

    await wrapper.setProps({ weight: 0, isEdit: false });

    expect(wrapper.find(weight).exists()).toBe(false);
  });

  it('shows repeats and weight', async () => {
    expect(wrapper.find(repeats).text()).toBe(`x${REPEATS}`);
    expect(wrapper.find(weight).text()).toBe(`${WEIGHT} кг`);
  });

  it('hides not done, to failure and duration in edit mode', async () => {
    expect(wrapper.find(notDone).exists()).toBe(false);
    expect(wrapper.find(toFailure).exists()).toBe(false);
    expect(wrapper.find(duration).exists()).toBe(false);
  });

  it('shows not done, to failure and duration in view mode, and hides buttons', async () => {
    await wrapper.setProps({ isEdit: false, isToFailure: true });

    expect(wrapper.find(notDone).exists()).toBe(true);
    expect(wrapper.find(toFailure).exists()).toBe(true);
    expect(wrapper.find(duration).exists()).toBe(true);

    expect(wrapper.find(indexDown).exists()).toBe(false);
    expect(wrapper.find(indexUp).exists()).toBe(false);
    expect(wrapper.find(createSet).exists()).toBe(false);
    expect(wrapper.find(deleteButton).exists()).toBe(false);
  });

  it('hides not done in future activities', async () => {
    expect(wrapper.find(notDone).exists()).toBe(false);

    await wrapper.setProps({ isEdit: false });

    expect(wrapper.find(notDone).exists()).toBe(true);

    await wrapper.setProps({ isEdit: false, isFutureActivity: true });

    expect(wrapper.find(notDone).exists()).toBe(false);
  });

  it('shows formatted duration', async () => {
    await wrapper.setProps({ isEdit: false });

    expect(wrapper.find(duration).text()).toBe(formatDuration(DURATION));
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

  it('emites createSet, repeats and weight', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('createSet');
    expect(wrapper.emitted()).not.toHaveProperty('editRepeats');
    expect(wrapper.emitted()).not.toHaveProperty('editWeight');

    await wrapper.find(createSet).trigger('click');

    expect(wrapper.emitted('createSet')).toHaveLength(1);
    expect(wrapper.emitted()['createSet'][0]).toStrictEqual([]);

    await wrapper.find(repeats).trigger('click');

    expect(wrapper.emitted('editRepeats')).toHaveLength(1);
    expect(wrapper.emitted()['editRepeats'][0]).toStrictEqual([]);

    await wrapper.find(weight).trigger('click');

    expect(wrapper.emitted('editWeight')).toHaveLength(1);
    expect(wrapper.emitted()['editWeight'][0]).toStrictEqual([]);
  });

  it('emits delete', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    await wrapper.find(deleteButton).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([]);
  });
});
