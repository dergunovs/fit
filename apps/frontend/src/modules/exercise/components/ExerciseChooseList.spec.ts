import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseChooseList from './ExerciseChooseList.vue';
import ExerciseChooseElement from './ExerciseChooseElement.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { filterExercisesByTitleAndMuscle } from '@/exercise/helpers';
import { USER_FIXTURE } from '@/user/fixtures';
import { spyUseAuthCheck } from '@/auth/mocks';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { spyGetMuscles } from '@/muscle/mocks';

const muscle = dataTest('muscle');
const title = dataTest('exercise-title');
const spoiler = dataTest('exercise-spoiler');
const exerciseChooseElement = dataTest('exercise-choose-element');

let wrapper: VueWrapper<InstanceType<typeof ExerciseChooseList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseChooseList, { exercises: EXERCISES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseChooseList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseChooseList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets muscles data', async () => {
    expect(spyGetMuscles).toHaveBeenCalledTimes(1);
  });

  it('shows muscles buttons', async () => {
    expect(wrapper.findAll(muscle).length).toBe(MUSCLES_FIXTURE.length + 1);
  });

  it('shows exercise spoilers', async () => {
    const filteredExercises = filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', '', USER_FIXTURE);

    expect(wrapper.findAll(spoiler).length).toBe(filteredExercises.length);
    expect(wrapper.find(spoiler).attributes('title')).toBe(filteredExercises[0].title);
  });

  it('shows exercises to choose', async () => {
    const filteredExercises = filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', '', USER_FIXTURE);

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);

    expect(wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).props('exercise')).toStrictEqual(
      filteredExercises[0]
    );
  });

  it('gets and sets user data', async () => {
    expect(spyUseAuthCheck).toHaveBeenCalledTimes(1);

    expect(wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).props('user')).toStrictEqual(
      USER_FIXTURE
    );
  });

  it('filters exercises to choose by title', async () => {
    const titleToFilter = EXERCISES_FIXTURE[0].title;

    const filteredExercises = filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, titleToFilter, '', USER_FIXTURE);

    await wrapper.findComponent(title).setValue(titleToFilter);

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('filters exercises to choose by muscle group', async () => {
    const muscleToFilter = MUSCLES_FIXTURE[0]._id;

    const filteredExercises = filterExercisesByTitleAndMuscle(EXERCISES_FIXTURE, '', muscleToFilter, USER_FIXTURE);

    await wrapper.findAll(muscle)[1].trigger('click');

    expect(wrapper.findAll(exerciseChooseElement).length).toBe(filteredExercises.length);
  });

  it('emits choosen exercise', async () => {
    wrapper.findComponent<typeof ExerciseChooseElement>(exerciseChooseElement).vm.$emit('add', EXERCISES_FIXTURE[0]);

    expect(wrapper.emitted('choose')).toHaveLength(1);
    expect(wrapper.emitted()['choose'][0]).toStrictEqual([EXERCISES_FIXTURE[0]]);
  });
});
