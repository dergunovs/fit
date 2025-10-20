import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiButtongroup } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseRepeats from './ExerciseRepeats.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_REPEATS_OPTIONS } from '@/exercise/constants';

const repeats = dataTest('exercise-repeats');

const MODEL_VALUE = 12;
const IS_TALL = true;
const OPTIONS = [1, 2, 3, 4, 5];
const BASE_REPEAT = 8;

let wrapper: VueWrapper<InstanceType<typeof ExerciseRepeats>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseRepeats, { modelValue: MODEL_VALUE, isTall: IS_TALL });
});

enableAutoUnmount(afterEach);

describe('ExerciseRepeats', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseRepeats)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('passes isTall props', async () => {
    expect(wrapper.find(repeats).attributes('istall')).toStrictEqual(IS_TALL.toString());
  });

  it('sets options from props', async () => {
    expect(wrapper.find(repeats).attributes('options')).toStrictEqual(EXERCISE_REPEATS_OPTIONS.join(','));

    await wrapper.setProps({ options: OPTIONS });

    expect(wrapper.find(repeats).attributes('options')).toStrictEqual(OPTIONS.join(','));
  });

  it('using base repeat to generate repeat options', async () => {
    expect(wrapper.find(repeats).attributes('options')).toStrictEqual(EXERCISE_REPEATS_OPTIONS.join(','));

    await wrapper.setProps({ baseRepeat: BASE_REPEAT });

    const optionsFromBaseRepeat = [BASE_REPEAT - 2, BASE_REPEAT - 1, BASE_REPEAT, BASE_REPEAT + 1, BASE_REPEAT + 2];

    expect(wrapper.find(repeats).attributes('options')).toStrictEqual(optionsFromBaseRepeat.join(','));
  });

  it('emits choosen options', async () => {
    const choosenOption = 2;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof UiButtongroup>(repeats).vm.$emit('update:modelValue', choosenOption);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([choosenOption]);
  });

  it('emits update:modelValue on mount if baseRepeats set', async () => {
    wrapper.unmount();

    const baseRepeat = 12;

    const wrapperWithBaseRepeats = wrapperFactory(ExerciseRepeats, { modelValue: undefined, baseRepeat });

    expect(wrapperWithBaseRepeats.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapperWithBaseRepeats.emitted()['update:modelValue'][0]).toStrictEqual([baseRepeat]);
  });
});
