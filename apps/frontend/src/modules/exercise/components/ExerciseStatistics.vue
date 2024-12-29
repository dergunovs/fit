<template>
  <div>
    <UiTable :headers="EXERCISE_STATISTICS_HEADERS" lang="ru">
      <tr v-for="exercise in props.statistics" :key="exercise._id" data-test="exercise-statistics-table-row">
        <td>
          <span data-test="exercise-statistics-title">{{ exercise.title }}</span>
        </td>
        <td>
          <div :class="$style.cell">
            <div :class="$style.count" data-test="exercise-statistics-sets-count">
              {{ exercise.sets }}<DynamicPercent :percent="exercise.setsDynamics" />
            </div>
            <div :class="$style.duration" data-test="exercise-statistics-sets-duration">
              {{ getAverageDuration(exercise, 'set') }}
            </div>
          </div>
        </td>
        <td>
          <div :class="$style.cell">
            <div :class="$style.count" data-test="exercise-statistics-repeats-count">
              {{ exercise.repeats }}<DynamicPercent :percent="exercise.repeatsDynamics" />
            </div>
            <div :class="$style.duration" data-test="exercise-statistics-repeats-duration">
              {{ getAverageDuration(exercise, 'repeat') }}
            </div>
          </div>
        </td>
      </tr>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import { IExerciseStatistics } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

import DynamicPercent from '@/common/components/DynamicPercent.vue';

import { EXERCISE_STATISTICS_HEADERS } from '@/exercise/constants';
import { getAverageDuration } from '@/exercise/helpers';

interface IProps {
  statistics: IExerciseStatistics[];
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.cell {
  display: flex;
  gap: 4px;
}

.count {
  display: flex;
  flex-wrap: nowrap;
}

.duration {
  align-self: flex-end;
  font-size: 0.875rem;
  color: var(--color-gray-dark-extra);
}

@media (max-width: 960px) {
  .cell {
    flex-direction: column;
  }

  .duration {
    align-self: flex-start;
  }
}
</style>
