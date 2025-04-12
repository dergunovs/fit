<template>
  <div>
    <UiFlex column>
      <UiFlex column gap="2">
        <b>{{ t('activity.monthData') }}</b>

        <div>
          <span>
            {{ t('duration') }}:
            <span data-test="activity-statistics-total-duration">
              {{ formatDuration(props.statistics.duration.cur, locale) }}</span
            ><DynamicPercent :percent="props.statistics.duration.dynamics" />,
          </span>
          <span>
            {{ t('activity.many').toLowerCase() }}:
            <span data-test="activity-statistics-total-count">{{ props.statistics.activitiesCount.cur }}</span
            ><DynamicPercent :percent="props.statistics.activitiesCount.dynamics" />,
          </span>
          <span>
            {{ t('set.many').toLowerCase() }}:
            <span data-test="activity-statistics-total-sets">{{ props.statistics.setsCount.cur }}</span
            ><DynamicPercent :percent="props.statistics.setsCount.dynamics" />,
          </span>
          <span>
            {{ t('repeat.many').toLowerCase() }}:
            <span data-test="activity-statistics-total-repeats">{{ props.statistics.repeatsCount.cur }}</span
            ><DynamicPercent :percent="props.statistics.repeatsCount.dynamics" />
          </span>
        </div>
      </UiFlex>

      <UiFlex column gap="2">
        <b>{{ t('activity.average') }}</b>

        <div>
          <span>
            {{ t('duration') }}:
            <span data-test="activity-statistics-average-duration">{{
              formatDuration(props.statistics.averageDuration.cur, locale)
            }}</span
            ><DynamicPercent :percent="props.statistics.averageDuration.dynamics" />,
          </span>
          <span>
            {{ t('set.inActivity').toLowerCase() }}:
            <span data-test="activity-statistics-average-sets">{{ props.statistics.averageSetsPerActivity.cur }}</span
            ><DynamicPercent :percent="props.statistics.averageSetsPerActivity.dynamics" />,
          </span>
          <span>
            {{ t('repeat.inSet').toLowerCase() }}:
            <span data-test="activity-statistics-average-repeats">{{ props.statistics.averageRepeatsPerSet.cur }}</span
            ><DynamicPercent :percent="props.statistics.averageRepeatsPerSet.dynamics" />,
          </span>
          <span>
            {{ t('rest').toLowerCase() }}:
            <span data-test="activity-statistics-average-rest">{{ props.statistics.averageRestPercent.cur }}%</span
            ><DynamicPercent :percent="props.statistics.averageRestPercent.dynamics" />
          </span>
        </div>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { IActivityStatistics } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { formatDuration } from 'mhz-helpers';

import DynamicPercent from '@/common/components/DynamicPercent.vue';

interface IProps {
  statistics: IActivityStatistics;
}

const props = defineProps<IProps>();

const { t, locale } = useI18n();
</script>
