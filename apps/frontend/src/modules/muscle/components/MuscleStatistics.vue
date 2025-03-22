<template>
  <div :class="$style.table">
    <UiTable :headers="MUSCLE_GROUP_STATISTICS_HEADERS">
      <tr v-for="muscle in props.statistics" :key="muscle.title" data-test="muscle-row">
        <td :style="{ color: muscle.color }" data-test="muscle-title">{{ muscle.title }}</td>
        <td data-test="muscle-sets">{{ muscle.sets }}</td>
        <td data-test="muscle-repeats">{{ muscle.repeats }}</td>
      </tr>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import { IMuscleStatistics } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

import { MUSCLE_GROUP_STATISTICS_HEADERS } from '@/exercise/constants';

interface IProps {
  statistics: IMuscleStatistics[];
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.table {
  display: table;
}
</style>
