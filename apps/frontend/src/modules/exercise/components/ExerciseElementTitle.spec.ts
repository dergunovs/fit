import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseElementTitle from './ExerciseElementTitle.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';

const title = dataTest('exercise-title');

const INDEX = 2;
const EXERCISES_COUNT = 4;

let wrapper: VueWrapper<InstanceType<typeof ExerciseElementTitle>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseElementTitle, {
    exercise: EXERCISE_FIXTURE,
    index: INDEX,
    exercisesCount: EXERCISES_COUNT,
  });
});

enableAutoUnmount(afterEach);

describe('ExerciseElementTitle', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseElementTitle)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(title).text()).toBe(EXERCISE_FIXTURE.title);

    await wrapper.setProps({ isEdit: true });

    expect(wrapper.find(title).text()).toBe(`${INDEX + 1}. ${EXERCISE_FIXTURE.title}`);

    await wrapper.setProps({ isPassing: true });

    expect(wrapper.find(title).text()).toBe(`${INDEX + 1} - ${EXERCISES_COUNT}. ${EXERCISE_FIXTURE.title}`);

    await wrapper.setProps({ exercise: undefined });

    expect(wrapper.find(title).text()).toBe('Упражнение удалено');
  });
});
