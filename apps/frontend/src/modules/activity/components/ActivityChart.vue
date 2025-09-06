<template>
  <div>
    <UiFlex column gap="16">
      <UiFlex gap="16" align="center" justify="space-between" wrap>
        <UiTabs :tabs="CHART_TYPES" v-model="type" data-test="activity-chart-types" />

        <UiFlex gap="16" justify="space-between">
          <UiCheckbox
            v-model="isMonth"
            isSwitcher
            :label="t('month')"
            :labelSwitcher="t('week')"
            data-test="activity-chart-month"
          />

          <UiCheckbox
            v-model="isAverage"
            isSwitcher
            :label="t('average')"
            :labelSwitcher="t('total')"
            :isDisabled="type === 'activity'"
            data-test="activity-chart-average"
          />
        </UiFlex>
      </UiFlex>

      <div :class="$style.chart">
        <UiChart
          v-if="chart"
          :labels="chart.labels"
          :datasets="chart.datasets"
          :isShowLegend="type === 'muscle'"
          type="Line"
          :key="`${locale}-${type}-${isMonth}-${chart?.datasets[0].data.join()}-${chart?.datasets[1].data.join()}`"
          :class="$style.chart"
          data-test="activity-chart"
        />
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UiChart, UiCheckbox, UiFlex, UiTabs } from 'mhz-ui';
import { TActivityChartType } from 'fitness-tracker-contracts';

import { activityService } from '@/activity/services';
import { useTI18n } from '@/common/composables';

const { t, locale } = useTI18n();

const CHART_TYPES = computed<{ title: string; value: TActivityChartType }[]>(() => [
  { title: t('activity.many'), value: 'activity' },
  { title: t('set.many'), value: 'set' },
  { title: t('repeat.many'), value: 'repeat' },
  { title: t('duration'), value: 'duration' },
  { title: t('muscle.many'), value: 'muscle' },
]);

const type = ref<TActivityChartType>(CHART_TYPES.value[0].value);

const isMonth = ref(false);
const isAverage = ref(false);

const { data: chart } = activityService.getChart(type, isMonth, isAverage, locale);
</script>

<style module lang="scss">
.chart {
  width: 100%;
  aspect-ratio: 5/3;
}
</style>
