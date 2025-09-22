import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseMuscleColors from './ExerciseMuscleColors.vue';

import { wrapperFactory } from '@/common/test';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

const color = dataTest('exercise-muscle-color');

let wrapper: VueWrapper<InstanceType<typeof ExerciseMuscleColors>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseMuscleColors, { muscles: MUSCLES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseMuscleColors', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseMuscleColors)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows colors', async () => {
    expect(wrapper.findAll(color).length).toStrictEqual(MUSCLES_FIXTURE.length);
    expect(wrapper.find(color).attributes('style')).toStrictEqual(
      `background: ${MUSCLES_FIXTURE[0].color}; height: ${100 / MUSCLES_FIXTURE.length}%;`
    );
  });
});
