<template>
  <div :class="$style.table">
    <UiTable :headers="MUSCLE_STATISTICS_HEADERS">
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
import { useI18n } from 'vue-i18n';
import { IMuscleStatistics } from 'fitness-tracker-contracts';
import { UiTable } from 'mhz-ui';

interface IProps {
  statistics: IMuscleStatistics[];
}

const props = defineProps<IProps>();

const { t } = useI18n();

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
