<template>
  <div :class="$style.table">
    <UiTable :headers="MUSCLE_GROUP_STATISTICS_HEADERS" lang="ru">
      <tr
        v-for="muscleGroup in generateMuscleGroupStatistics(props.exercises)"
        :key="muscleGroup.title"
        data-test="exercise-muscle-group-row"
      >
        <td data-test="exercise-muscle-group-title">{{ muscleGroup.title }}</td>
        <td data-test="exercise-muscle-group-sets">{{ muscleGroup.sets }}</td>
        <td data-test="exercise-muscle-group-repeats">{{ muscleGroup.repeats }}</td>
      </tr>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import { IExerciseDone } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

import { generateMuscleGroupStatistics } from '@/exercise/helpers';
import { MUSCLE_GROUP_STATISTICS_HEADERS } from '@/exercise/constants';

interface IProps {
  exercises: IExerciseDone[];
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.table {
  display: table;
}
</style>
