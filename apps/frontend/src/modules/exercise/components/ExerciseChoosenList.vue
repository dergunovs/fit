<template>
  <div>
    <UiFlex column>
      <ExerciseChoosenElement
        v-for="(exercise, index) in props.choosenExercises"
        :key="exercise._id"
        :exercise="exercise"
        :index="index + 1"
        @delete="(id) => emit('delete', id)"
        data-test="exercise-choosen"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { IExerciseChoosen } from 'fitness-tracker-contracts';

import ExerciseChoosenElement from '@/exercise/components/ExerciseChoosenElement.vue';

interface IProps {
  choosenExercises: IExerciseChoosen[];
}

const props = defineProps<IProps>();
const emit = defineEmits<{ delete: [id: string] }>();
</script>
