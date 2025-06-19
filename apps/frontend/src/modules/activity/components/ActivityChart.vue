<template>
  <div>
    <UiFlex column gap="16">
      <UiFlex gap="16" align="center" wrap>
        <UiFlex gap="6">
          <UiButton
            v-for="chartType in CHART_TYPES"
            :key="chartType.value"
            :layout="chartType.value === type ? 'accent' : 'primary'"
            isNarrow
            @click="type = chartType.value"
            data-test="activity-chart-type"
            >{{ chartType.title }}
          </UiButton>
        </UiFlex>

        <UiCheckbox
          v-model="isMonth"
          isSwitcher
          :label="t('month')"
          :labelSwitcher="t('week')"
          data-test="activity-chart-month"
        />
      </UiFlex>

      <div :class="$style.chart">
        <UiChart
          v-if="chart"
          :labels="chart.labels"
          :datasets="chart.datasets"
          :isShowLegend="type === 'muscle'"
          type="Line"
          :key="`${locale}-${type}-${isMonth}-${chart?.datasets[0].data.join()}`"
          :class="$style.chart"
          data-test="activity-chart"
        />
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { UiButton, UiChart, UiCheckbox, UiFlex } from 'mhz-ui';
import { TActivityChartType } from 'fitness-tracker-contracts';

import { activityService } from '@/activity/services';

const { t, locale } = useI18n();

const CHART_TYPES = computed(
  () =>
    [
      { title: t('activity.many'), value: 'activity' },
      { title: t('set.many'), value: 'set' },
      { title: t('repeat.many'), value: 'repeat' },
      { title: t('muscle.many'), value: 'muscle' },
    ] as { title: string; value: TActivityChartType }[]
);

const type = ref<TActivityChartType>(CHART_TYPES.value[0].value);
const isMonth = ref(false);

const { data: chart } = activityService.getChart(type, isMonth, locale);
</script>

<style module lang="scss">
.chart {
  width: 100%;
  aspect-ratio: 5/3;
}
</style>
