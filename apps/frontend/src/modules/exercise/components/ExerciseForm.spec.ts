import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_EXERCISE, EXERCISE_MUSCLE_GROUPS } from 'fitness-tracker-contracts';
import { UiCheckbox } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseForm from './ExerciseForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyCreateExercise, spyUpdateExercise, spyDeleteExercise } from '@/exercise/mocks';
import { spyRefetchQueries, spyRemoveQueries, spyRouterPush, spyToastSuccess, mockIsValid } from '@/common/mocks';
import { URL_EXERCISE } from '@/exercise/constants';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';

const TITLE = 'Название';

const form = dataTest('exercise-form');
const formTitle = dataTest('exercise-form-title');
const formMuscleGroups = dataTest('exercise-form-muscle-groups');
const formButtons = dataTest('exercise-form-buttons');

const wrapperWithExercise: VueWrapper<InstanceType<typeof ExerciseForm>> = wrapperFactory(ExerciseForm, {
  exercise: EXERCISE_FIXTURE,
});

let wrapper: VueWrapper<InstanceType<typeof ExerciseForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseForm);
});

enableAutoUnmount(afterEach);

describe('ExerciseForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseForm)).toBeTruthy();
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyCreateExercise).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('creates exericse', async () => {
    const CHECKBOX_INDEX = 1;

    expect(spyCreateExercise).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formTitle).setValue(TITLE);

    wrapper
      .findAllComponents<typeof UiCheckbox>(formMuscleGroups)
      [CHECKBOX_INDEX].vm.$emit('update:modelValue', EXERCISE_MUSCLE_GROUPS[CHECKBOX_INDEX], true);

    await nextTick();

    await wrapper.find(form).trigger('submit');

    expect(spyCreateExercise).toBeCalledTimes(1);
    expect(spyCreateExercise).toBeCalledWith({
      title: TITLE,
      muscleGroups: [EXERCISE_MUSCLE_GROUPS[CHECKBOX_INDEX]],
      equipment: undefined,
      equipmentForWeight: [],
      isWeights: false,
      isWeightsRequired: false,
    });

    await mockOnSuccess.create?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);
  });

  it('updates exericse', async () => {
    expect(spyUpdateExercise).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    const NEW_TITLE = 'Новое название';

    await wrapperWithExercise.findComponent(formTitle).setValue(NEW_TITLE);

    await wrapperWithExercise.find(form).trigger('submit');

    expect(spyUpdateExercise).toBeCalledTimes(1);
    expect(spyUpdateExercise).toBeCalledWith({
      _id: EXERCISE_FIXTURE._id,
      title: NEW_TITLE,
      muscleGroups: EXERCISE_FIXTURE.muscleGroups,
      createdBy: EXERCISE_FIXTURE.createdBy,
      isWeights: EXERCISE_FIXTURE.isWeights,
      isWeightsRequired: EXERCISE_FIXTURE.isWeightsRequired,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('deletes exericse', async () => {
    expect(spyDeleteExercise).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    wrapperWithExercise.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', EXERCISE_FIXTURE._id);

    expect(spyDeleteExercise).toBeCalledTimes(1);
    expect(spyDeleteExercise).toBeCalledWith(EXERCISE_FIXTURE._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithExercise.find(formButtons).attributes('id')).toBe(EXERCISE_FIXTURE._id);
  });
});
