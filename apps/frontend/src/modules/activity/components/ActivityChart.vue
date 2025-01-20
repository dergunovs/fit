<template>
  <div>
    <UiFlex column gap="16">
      <UiFlex gap="6">
        <UiButton
          v-for="chartType in CHART_TYPES"
          :key="chartType.value"
          :layout="chartType.value === type ? 'accent' : 'primary'"
          isNarrow
          @click="type = chartType.value"
          data-test="activity-chart-type"
          >{{ chartType.title }}</UiButton
        >
      </UiFlex>

      <div :class="$style.chart">
        <UiChart
          v-if="chart"
          :labels="chart.labels"
          :datasets="chart.datasets"
          :isShowLegend="type === 'group'"
          type="Line"
          :key="`${type}-${chart?.datasets[0].data.join()}`"
          :class="$style.chart"
          data-test="activity-chart"
        />
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiChart, UiFlex } from 'mhz-ui';
import { TActivityChartType } from 'fitness-tracker-contracts';

import { activityService } from '@/activity/services';
import { CHART_TYPES } from '@/activity/constants';

const type = ref<TActivityChartType>(CHART_TYPES[0].value);

const { data: chart } = activityService.getChart(type);
</script>

<style module lang="scss">
.chart {
  width: 100%;
  aspect-ratio: 2/1;
}
</style>
