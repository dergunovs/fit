<template>
  <div v-if="props.statistics.length > 0" :class="$style.table">
    <UiTable :headers="MUSCLE_STATISTICS_HEADERS" :lang="locale">
      <tr v-for="muscle in props.statistics" :key="muscle.title" data-test="muscle-row">
        <td :style="{ color: muscle.color }" data-test="muscle-title">{{ muscle.title }}</td>
        <td data-test="muscle-sets">{{ muscle.sets }}</td>
        <td data-test="muscle-repeats">{{ muscle.repeats }}</td>
      </tr>
    </UiTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IMuscleStatistics } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

import { useTI18n } from '@/common/composables';

interface IProps {
  statistics: IMuscleStatistics[];
}

const props = defineProps<IProps>();

const { t, locale } = useTI18n();

const MUSCLE_STATISTICS_HEADERS = computed(() => [
  { title: t('muscle.many') },
  { title: t('set.many') },
  { title: t('repeat.many') },
]);
</script>

<style module lang="scss">
.table {
  display: table;
}
</style>
