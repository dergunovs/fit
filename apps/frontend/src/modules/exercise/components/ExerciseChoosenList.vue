<template>
  <UiFlex column>
    <h3>{{ t('exercise.many') }}</h3>

    <ExerciseChoosenElement
      v-for="(exercise, index) in props.choosenExercises"
      :key="exercise._id"
      :exercise="exercise"
      :index="index"
      :isLast="index === props.choosenExercises.length - 1"
      :isSetCreatable="isSetCreatable(props.choosenExercises, index, exercise.exercise?._id)"
      @delete="(id) => emit('delete', id)"
      @createSet="emit('createSet')"
      @setIndex="(updatedIndex) => emit('setIndex', updatedIndex)"
      data-test="exercise-choosen"
    />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChoosenElement from '@/exercise/components/ExerciseChoosenElement.vue';

import { isSetCreatable } from '@/exercise/helpers';
import { useTI18n } from '@/common/composables';

interface IProps {
  choosenExercises: IExerciseChoosen[];
}

interface IEmit {
  delete: [id: string];
  createSet: [];
  setIndex: [index: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const { t } = useTI18n();
</script>
