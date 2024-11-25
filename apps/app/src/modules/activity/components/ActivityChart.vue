<template>
  <div>
    <UiFlex column>
      <UiFlex>
        <UiButton
          v-for="chartType in CHART_TYPES"
          :key="chartType.value"
          :layout="chartType.value === type ? 'accent' : 'primary'"
          isNarrow
          @click="type = chartType.value"
          >{{ chartType.title }}</UiButton
        >
      </UiFlex>

      <UiChart v-if="chart" :labels="chart.labels" :data="chart.data" type="Line" :key="type" :class="$style.chart" />
      <div v-else :class="$style.chartSkeleton"></div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiChart, UiFlex } from 'mhz-ui';
import { TActivityChartType } from 'fitness-tracker-contracts';

import { getActivityChart } from '@/activity/services';
import { CHART_TYPES } from '@/activity/constants';

const type = ref<TActivityChartType>('activity');

const { data: chart } = getActivityChart(type);
</script>

<style module lang="scss">
.chart,
.chartSkeleton {
  width: 100%;
  aspect-ratio: 2/1;
}
</style>
