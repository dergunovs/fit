import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY_STATISTICS, API_EXERCISE } from 'fitness-tracker-contracts';
import { UiCheckbox } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ExerciseForm from './ExerciseForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyCreateExercise, spyUpdateExercise, spyDeleteExercise } from '@/exercise/mocks';
import { spyRefetchQueries, spyRouterPush, spyToastSuccess, mockIsValid, spyRemoveQueries } from '@/common/mocks';
import { URL_EXERCISE } from '@/exercise/constants';
import { EXERCISE_FIXTURE } from '@/exercise/fixtures';
import { spyGetEquipments } from '@/equipment/mocks';
import { filterEquipmentByWeights } from '@/equipment/helpers';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { spyGetMuscles } from '@/muscle/mocks';

const TITLE = 'Упражнение';
const TITLE_EN = 'Exercise';
const DESCRIPTION = 'Описание упражнения';
const DESCRIPTION_EN = 'Exercise descriptions';

const form = dataTest('exercise-form');
const formTitle = dataTest('exercise-form-title');
const formTitleEn = dataTest('exercise-form-title-en');
const formDescription = dataTest('exercise-form-description');
const formDescriptionEn = dataTest('exercise-form-description-en');
const formIsWeights = dataTest('exercise-form-is-weights');
const formIsWeightsRequired = dataTest('exercise-form-is-weights-required');
const formEquipmentForWeight = dataTest('exercise-form-equipment-for-weight');
const formMuscleGroups = dataTest('exercise-form-muscle-groups');
const formButtons = dataTest('exercise-form-buttons');

const wrapperWithExercise: VueWrapper<InstanceType<typeof ExerciseForm>> = wrapperFactory(ExerciseForm, {
  exercise: EXERCISE_FIXTURE,
  isEdit: true,
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

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets equipment', async () => {
    expect(spyGetEquipments).toBeCalledTimes(1);
  });

  it('gets muscles', async () => {
    expect(spyGetMuscles).toBeCalledTimes(1);
  });

  it('shows equipment for weights', async () => {
    await wrapper.findComponent(formIsWeights).setValue(true);

    expect(wrapper.findAll(formEquipmentForWeight).length).toBe(
      filterEquipmentByWeights(EQUIPMENTS_FIXTURE, true).length
    );

    expect(wrapper.find(formEquipmentForWeight).attributes('label')).toBe(
      filterEquipmentByWeights(EQUIPMENTS_FIXTURE, true)[0].title
    );
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyCreateExercise).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('creates exercise', async () => {
    const CHECKBOX_INDEX = 1;

    expect(spyCreateExercise).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formTitle).setValue(TITLE);
    await wrapper.findComponent(formTitleEn).setValue(TITLE_EN);
    await wrapper.findComponent(formDescription).setValue(DESCRIPTION);
    await wrapper.findComponent(formDescriptionEn).setValue(DESCRIPTION_EN);

    expect(wrapper.find(formIsWeightsRequired).exists()).toBe(false);

    await wrapper.findComponent(formIsWeights).setValue(true);

    expect(wrapper.find(formIsWeightsRequired).exists()).toBe(true);

    await wrapper.findComponent(formIsWeightsRequired).setValue(true);

    await wrapper.findComponent(formEquipmentForWeight).setValue(true);

    wrapper
      .findAllComponents<typeof UiCheckbox>(formMuscleGroups)
      [CHECKBOX_INDEX].vm.$emit('update:modelValue', MUSCLES_FIXTURE[CHECKBOX_INDEX], true);

    await nextTick();

    await wrapper.find(form).trigger('submit');

    expect(spyCreateExercise).toBeCalledTimes(1);
    expect(spyCreateExercise).toBeCalledWith({
      title: TITLE,
      title_en: TITLE_EN,
      description: DESCRIPTION,
      description_en: DESCRIPTION_EN,
      muscles: [MUSCLES_FIXTURE[CHECKBOX_INDEX]],
      equipment: undefined,
      equipmentForWeight: [filterEquipmentByWeights(EQUIPMENTS_FIXTURE, true)[0]],
      isWeights: true,
      isWeightsRequired: true,
    });

    await mockOnSuccess.create?.();

    expect(spyRefetchQueries).toBeCalledTimes(2);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);

    expect(wrapper.emitted('hide')).toHaveLength(1);
  });

  it('updates exercise', async () => {
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
      title_en: EXERCISE_FIXTURE.title_en,
      description: EXERCISE_FIXTURE.description,
      muscles: EXERCISE_FIXTURE.muscles,
      createdBy: EXERCISE_FIXTURE.createdBy,
      isWeights: EXERCISE_FIXTURE.isWeights,
      isWeightsRequired: EXERCISE_FIXTURE.isWeightsRequired,
      equipment: EXERCISE_FIXTURE.equipment,
      equipmentForWeight: EXERCISE_FIXTURE.equipmentForWeight,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(2);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(wrapper.emitted('hide')).toHaveLength(1);
  });

  it('deletes exercise', async () => {
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

    expect(spyRefetchQueries).toBeCalledTimes(2);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EXERCISE] });
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY_STATISTICS] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EXERCISE);

    expect(wrapper.emitted('hide')).toHaveLength(1);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithExercise.find(formButtons).attributes('id')).toBe(EXERCISE_FIXTURE._id);
  });

  it('emits hide by form buttons cancel emit', async () => {
    wrapper.findComponent<typeof FormButtons>(formButtons).vm.$emit('cancel');

    expect(wrapper.emitted('hide')).toHaveLength(1);
  });
});
