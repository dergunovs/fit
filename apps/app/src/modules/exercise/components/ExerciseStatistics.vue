<template>
  <div>
    <UiTable :headers="EXERCISE_STATISTICS_HEADERS" lang="ru">
      <tr v-for="exercise in props.exerciseStatistics" :key="exercise._id">
        <td>
          <span>{{ exercise.title }}</span>
        </td>
        <td>
          <div :class="$style.cell">
            <span>{{ exercise.sets }}</span>
            <span :class="$style.time">{{ getAverageDuration(exercise, 'set') }}</span>
          </div>
        </td>
        <td>
          <div :class="$style.cell">
            <span>{{ Math.round(exercise.repeats / exercise.sets) }}</span>
            <span :class="$style.time">{{ getAverageDuration(exercise, 'repeat') }}</span>
          </div>
        </td>
      </tr>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import { IExerciseStatistics } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

import { EXERCISE_STATISTICS_HEADERS } from '@/exercise/constants';

interface IProps {
  exerciseStatistics: IExerciseStatistics[];
}

const props = defineProps<IProps>();

function getAverageDuration(exercise: IExerciseStatistics, type: 'set' | 'repeat') {
  return type === 'set'
    ? `${((exercise.averageDuration * exercise.repeats) / exercise.sets || 0).toFixed(1)}с`
    : `${exercise.averageDuration.toFixed(1)}с`;
}
</script>

<style module lang="scss">
.cell {
  display: flex;
  gap: 4px;
  align-items: baseline;
}

.time {
  font-size: 0.875rem;
  color: var(--color-gray-dark-extra);
}

@media (max-width: 960px) {
  .cell {
    flex-direction: column;
  }
}
</style>
