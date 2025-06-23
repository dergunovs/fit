<template>
  <div>
    <ExerciseRestTimer
      v-if="!props.activeExerciseId && currentExerciseIndex && currentExerciseIndex !== props.exercises.length"
      data-test="exercise-rest-timer"
    />

    <UiFlex column>
      <ExercisePassingElement
        v-for="(exercise, index) in props.exercises"
        :key="exercise._id"
        :exercise="exercise"
        :activeExerciseId="props.activeExerciseId"
        :isCurrentExercise="index === currentExerciseIndex"
        :index="index + 1"
        :exercisesCount="props.exercises.length"
        @start="(id) => emit('start', id)"
        @stop="(exerciseDone) => emit('stop', exerciseDone)"
        data-test="exercise-element"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';

import ExerciseRestTimer from '@/exercise/components/ExerciseRestTimer.vue';
import ExercisePassingElement from '@/exercise/components/ExercisePassingElement.vue';

interface IProps {
  exercises: IExerciseDone[];
  activeExerciseId?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ start: [id: string]; stop: [exerciseDone: IExerciseDone] }>();

const currentExerciseIndex = computed(() => props.exercises.filter((exercise) => exercise.isDone).length);
</script>
