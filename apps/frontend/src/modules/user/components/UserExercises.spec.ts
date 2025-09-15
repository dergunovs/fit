import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiChip } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import UserExercises from './UserExercises.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';

const userExercise = dataTest('user-exercise');
const userExerciseTitle = dataTest('user-exercise-title');

let wrapper: VueWrapper<InstanceType<typeof UserExercises>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserExercises, { exercises: EXERCISES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('UserExercises', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserExercises)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows user exercises', async () => {
    expect(wrapper.findAll(userExercise).length).toStrictEqual(EXERCISES_FIXTURE.length);
    expect(wrapper.find(userExerciseTitle).text()).toStrictEqual(EXERCISES_FIXTURE[0].title);
  });

  it('emits user exercise to edit', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    wrapper.findComponent<typeof UiChip>(userExercise).vm.$emit('edit');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([EXERCISES_FIXTURE[0]]);
  });
});
