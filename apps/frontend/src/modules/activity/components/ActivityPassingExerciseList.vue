<template>
  <div>
    <UiFlex column>
      <ActivityPassingExerciseElement
        v-for="(exercise, index) in props.exercises"
        :key="exercise._id"
        :exercise="exercise"
        :activeExerciseId="props.activeExerciseId"
        :isCurrentExercise="index === currentExerciseIndex"
        :index="index + 1"
        :exercisesCount="props.exercises.length"
        @start="(id) => emit('start', id)"
        @stop="(exerciseDone) => emit('stop', exerciseDone)"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';

import ActivityPassingExerciseElement from '@/activity/components/ActivityPassingExerciseElement.vue';

interface IProps {
  exercises: IExerciseDone[];
  activeExerciseId?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['start', 'stop']);

const currentExerciseIndex = computed(() => props.exercises.filter((exercise) => exercise.isDone).length);
</script>
