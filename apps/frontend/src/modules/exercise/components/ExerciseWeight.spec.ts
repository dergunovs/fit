import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { enableAutoUnmount, VueWrapper } from '@vue/test-utils';
import { UiSelect } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseWeight from './ExerciseWeight.vue';
import { wrapperFactory } from '@/common/test';

const select = dataTest('exercise-weight');

let wrapper: VueWrapper<InstanceType<typeof ExerciseWeight>>;

const OPTIONS = [50, 60, 70, 80, 90];
const MODEL_VALUE = 70;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseWeight, { options: OPTIONS, modelValue: MODEL_VALUE });
});

enableAutoUnmount(afterEach);

describe('ExerciseWeight', () => {
  it('exists', () => {
    expect(wrapper.findComponent(ExerciseWeight)).toBeTruthy();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets props to select', () => {
    expect(wrapper.find(select).attributes('modelvalue')).toStrictEqual(MODEL_VALUE.toString());
    expect(wrapper.find(select).attributes('options')).toStrictEqual(OPTIONS.join(','));
  });

  it('emits updated weight', () => {
    const choosenOption = 20;

    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');

    wrapper.findComponent<typeof UiSelect>(select).vm.$emit('update:modelValue', choosenOption);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([choosenOption]);
  });
});
