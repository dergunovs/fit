<template>
  <div>
    <UiFlex column>
      <div>
        <b>Данные за месяц</b>
        <br />
        <span>
          Длительность:
          <span data-test="activity-statistics-total-duration">
            {{ formatDuration(props.statistics.duration.cur) }}</span
          ><DynamicPercent :percent="props.statistics.duration.dynamics" />,
        </span>
        <span>
          занятия: <span data-test="activity-statistics-total-count">{{ props.statistics.activitiesCount.cur }}</span
          ><DynamicPercent :percent="props.statistics.activitiesCount.dynamics" />,
        </span>
        <span>
          подходы: <span data-test="activity-statistics-total-sets">{{ props.statistics.setsCount.cur }}</span
          ><DynamicPercent :percent="props.statistics.setsCount.dynamics" />,
        </span>
        <span>
          повторы: <span data-test="activity-statistics-total-repeats">{{ props.statistics.repeatsCount.cur }}</span
          ><DynamicPercent :percent="props.statistics.repeatsCount.dynamics" />
        </span>
      </div>

      <div>
        <b>Средние значения</b>
        <br />
        <span>
          Длительность:
          <span data-test="activity-statistics-average-duration">{{
            formatDuration(props.statistics.averageDuration.cur)
          }}</span
          ><DynamicPercent :percent="props.statistics.averageDuration.dynamics" />,
        </span>
        <span>
          подходов в занятии:
          <span data-test="activity-statistics-average-sets">{{ props.statistics.averageSetsPerActivity.cur }}</span
          ><DynamicPercent :percent="props.statistics.averageSetsPerActivity.dynamics" />,
        </span>
        <span>
          повторов в подходе:
          <span data-test="activity-statistics-average-repeats">{{ props.statistics.averageRepeatsPerSet.cur }}</span
          ><DynamicPercent :percent="props.statistics.averageRepeatsPerSet.dynamics" />,
        </span>
        <span>
          отдых:
          <span data-test="activity-statistics-average-rest">{{ props.statistics.averageRestPercent.cur }}%</span
          ><DynamicPercent :percent="props.statistics.averageRestPercent.dynamics" />
        </span>
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IActivityStatistics } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { formatDuration } from 'mhz-helpers';

import DynamicPercent from '@/common/components/DynamicPercent.vue';

interface IProps {
  statistics: IActivityStatistics;
}

const props = defineProps<IProps>();
</script>
