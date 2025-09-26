<template>
  <div>
    <UiModal
      :modelValue="props.isShowModal"
      @update:modelValue="(value) => updateModal(value)"
      isScrollable
      data-test="exercise-modal"
    >
      <ExerciseChooseList
        v-if="exercisesAll?.length"
        :exercises="exercisesAll"
        @choose="addExercises"
        data-test="exercise-choose-list"
      />
    </UiModal>

    <UiFlex v-if="props.modelValue?.length" column>
      <h3>{{ t('exercise.many') }}</h3>

      <ExerciseElementList
        :exercises="props.modelValue"
        isEdit
        @delete="deleteExercise"
        @createSet="createSet"
        @setIndex="updateIndex"
        @setRepeats="updateRepeats"
        @setWeight="updateWeight"
        data-test="exercise-element-list"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex, UiModal } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseElementList from '@/exercise/components/ExerciseElementList.vue';

import { useTI18n } from '@/common/composables';
import { exerciseService } from '@/exercise/services';
import {
  addSetToExercises,
  updateExercisesIndex,
  updateExercisesRepeats,
  updateExercisesWeight,
} from '@/exercise/helpers';

interface IProps {
  isShowModal: boolean;
  modelValue?: IExerciseChoosen[];
}

interface IEmit {
  updateModal: [value: boolean];
  'update:modelValue': [exercises: IExerciseChoosen[]];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();

const { data: exercisesAll } = exerciseService.getAll();

function addExercises(exercises: IExerciseChoosen[]) {
  const updatedExercises = props.modelValue?.length ? [...props.modelValue, ...exercises] : exercises;

  emit('update:modelValue', updatedExercises);

  updateModal(false);
}

function deleteExercise(idToDelete: string) {
  const updatedExercises = props.modelValue?.filter((exercise) => exercise._id !== idToDelete) || [];

  emit('update:modelValue', updatedExercises);
}

function createSet() {
  if (!props.modelValue) return;

  const updatedExercises = addSetToExercises(props.modelValue);

  emit('update:modelValue', updatedExercises);
}

function updateIndex(updatedIndex: number) {
  if (!props.modelValue) return;

  const updatedExercises = updateExercisesIndex(props.modelValue, updatedIndex);

  emit('update:modelValue', updatedExercises);
}

function updateRepeats(repeats: number, id?: string) {
  if (!props.modelValue || !id) return;

  const updatedExercises = updateExercisesRepeats(props.modelValue, repeats, id);

  emit('update:modelValue', updatedExercises);
}

function updateWeight(weight: number, id?: string) {
  if (!props.modelValue || !id) return;

  const updatedExercises = updateExercisesWeight(props.modelValue, weight, id);

  emit('update:modelValue', updatedExercises);
}

function updateModal(value: boolean) {
  emit('updateModal', value);
}
</script>
