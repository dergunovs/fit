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

    <ExerciseChoosenList
      v-if="props.modelValue?.length"
      :choosenExercises="props.modelValue"
      @delete="deleteExercise"
      @createSet="createSet"
      @setIndex="updateIndex"
      data-test="exercise-choosen-list"
    />
  </div>
</template>

<script setup lang="ts">
import { UiModal } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';

import { exerciseService } from '@/exercise/services';
import { addSetToExercises, updateExercisesIndex } from '@/exercise/helpers';

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

function updateModal(value: boolean) {
  emit('updateModal', value);
}
</script>
