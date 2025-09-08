<template>
  <UiModal
    :modelValue="props.isShowModal"
    @update:modelValue="(value) => updateModal(value)"
    isScrollable
    data-test="exercise-modal"
  >
    <ExerciseChooseList
      v-if="exercises?.length"
      :exercises="exercises"
      @choose="addExercise"
      data-test="exercise-choose-list"
    />
  </UiModal>

  <ExerciseChoosenList
    v-if="props.modelValue?.length"
    :choosenExercises="props.modelValue"
    @delete="deleteExercise"
    @createSet="createSet"
    data-test="exercise-choosen-list"
  />
</template>

<script setup lang="ts">
import { UiModal } from 'mhz-ui';
import { createTempId } from 'mhz-helpers';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { exerciseService } from '@/exercise/services';

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

const { data: exercises } = exerciseService.getAll();

function addExercise(exercise: IExerciseChoosen) {
  const updatedExercises = props.modelValue?.length ? [...props.modelValue, exercise] : [exercise];

  emit('update:modelValue', updatedExercises);

  updateModal(false);
}

function deleteExercise(idToDelete: string) {
  const updatedExercises = props.modelValue?.filter((exercise) => exercise._id !== idToDelete) || [];

  emit('update:modelValue', updatedExercises);
}

function createSet() {
  if (!props.modelValue) return;

  const set = props.modelValue.slice(-2).map((exercise) => {
    return { ...exercise, _id: createTempId() };
  });

  const updatedExercises = [...props.modelValue, ...set];

  emit('update:modelValue', updatedExercises);
}

function updateModal(value: boolean) {
  emit('updateModal', value);
}
</script>
