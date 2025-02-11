import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseRepeatsChoice from './ExerciseRepeatsChoice.vue';

import { wrapperFactory } from '@/common/test';

const titleText = dataTest('exercise-repeats-choice-title');
const buttons = dataTest('exercise-repeats-choice-buttons');
const button = dataTest('exercise-repeats-choice-button');
const input = dataTest('exercise-repeats-choice-input');

const options = [1, 2, 3, 4, 5];
const modelValue = options[2];
const title = 'Заголовок';
const isTall = true;

let wrapper: VueWrapper<InstanceType<typeof ExerciseRepeatsChoice>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseRepeatsChoice, { options, modelValue, title, isTall });
});

enableAutoUnmount(afterEach);

describe('ExerciseRepeatsChoice', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseRepeatsChoice)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(titleText).text()).toBe(title);
  });

  it('shows tall buttons by props', async () => {
    expect(wrapper.find(buttons).attributes('data-tall')).toBe(isTall.toString());

    await wrapper.setProps({ isTall: false });

    expect(wrapper.find(buttons).attributes('data-tall')).toBe('false');
  });

  it('shows buttons', async () => {
    expect(wrapper.findAll(button).length).toBe(options.length);
    expect(wrapper.find(button).text()).toBe(options[0].toString());
    expect(wrapper.find(button).attributes('data-current')).toBe((modelValue === options[0]).toString());
  });

  it('shows input', async () => {
    expect(wrapper.find(input).attributes('value')).toBe(modelValue.toString());
  });

  it('emits choosen value', async () => {
    await wrapper.find(button).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([options[0]]);

    wrapper.find(input).setValue(options[1]);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    expect(wrapper.emitted()['update:modelValue'][1]).toStrictEqual([options[1]]);
  });
});
