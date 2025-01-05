import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ExerciseList from './ExerciseList.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { URL_EXERCISE_EDIT } from '@/exercise/constants';

const exerciseTableRow = dataTest('exercise-table-row');
const exerciseTableTitleLink = dataTest('exercise-table-title-link');

let wrapper: VueWrapper<InstanceType<typeof ExerciseList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseList, { exercises: EXERCISES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ExerciseList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseList)).toBeTruthy();
  });

  it('shows exercises in table', async () => {
    expect(wrapper.findAll(exerciseTableRow).length).toBe(EXERCISES_FIXTURE.length);
    expect(wrapper.find(exerciseTableTitleLink).text()).toBe(EXERCISES_FIXTURE[0].title);
  });

  it('sets exercise page link', async () => {
    expect(wrapper.find(exerciseTableTitleLink).attributes('to')).toBe(
      `${URL_EXERCISE_EDIT}/${EXERCISES_FIXTURE[0]._id}`
    );
  });
});
