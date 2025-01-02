import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ActivityForm from './ActivityForm.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';
import { spyGetActivity, spyGetActivityLast } from '@/activity/mocks';
import { spyGetExercises } from '@/exercise/mocks';
import { mockRouteId, spyUseRouteId } from '@/common/mocks';

const averageRestPercent = 50;

// const form = dataTest('activity-form');
// const formContainer = dataTest('activity-form-container');
// const potentialDuration = dataTest('activity-form-potential-duration');
// const repeatLast = dataTest('activity-form-repeat-last');
// const addExercise = dataTest('activity-form-add-exercise');
// const addExerciseModal = dataTest('activity-form-add-exercise-modal');
// const exerciseChooseList = dataTest('activity-form-exercise-choose-list');
// const exercisesChoosenContainer = dataTest('activity-form-exercises-choosen-container');
// const exercisesChoosen = dataTest('activity-form-exercises-choosen');
// const submit = dataTest('activity-form-submit');

let wrapper: VueWrapper<InstanceType<typeof ActivityForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityForm, {
    exerciseStatistics: ACTIVITIES_STATISTICS_FIXTURE.exercise,
    averageRestPercent,
  });
});

enableAutoUnmount(afterEach);

describe('ActivityForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityForm)).toBeTruthy();
  });

  it('gets exercises, last activity and activity to copy', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('copy', true);

    expect(spyGetExercises).toBeCalledTimes(1);

    expect(spyGetActivityLast).toBeCalledTimes(1);

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({ enabled: !!mockRouteId.value }, mockRouteId);
  });
});
