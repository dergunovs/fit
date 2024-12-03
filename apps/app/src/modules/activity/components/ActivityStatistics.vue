<template>
  <div>
    <UiFlex column>
      <div>
        <b>Данные за 21 день</b>
        <br />
        <span
          >Длительность: {{ formatDuration(props.activityStatistics.duration.cur) }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.duration.dynamics > 0"
            :data-negative="props.activityStatistics.duration.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.duration.dynamics) }}</sup
          >,
        </span>
        <span
          >занятия: {{ props.activityStatistics.activitiesCount.cur }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.activitiesCount.dynamics > 0"
            :data-negative="props.activityStatistics.activitiesCount.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.activitiesCount.dynamics) }}</sup
          >,
        </span>
        <span
          >сеты: {{ props.activityStatistics.setsCount.cur }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.setsCount.dynamics > 0"
            :data-negative="props.activityStatistics.setsCount.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.setsCount.dynamics) }}</sup
          >,
        </span>
        <span
          >повторы: {{ props.activityStatistics.repeatsCount.cur }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.repeatsCount.dynamics > 0"
            :data-negative="props.activityStatistics.repeatsCount.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.repeatsCount.dynamics) }}</sup
          ></span
        >
      </div>

      <div>
        <b>Средние значения</b>
        <br />
        <span
          >Длительность: {{ formatDuration(props.activityStatistics.averageDuration.cur) }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.averageDuration.dynamics > 0"
            :data-negative="props.activityStatistics.averageDuration.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.averageDuration.dynamics) }}</sup
          >,
        </span>
        <span
          >сетов в занятии: {{ props.activityStatistics.averageSetsPerActivity.cur }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.averageSetsPerActivity.dynamics > 0"
            :data-negative="props.activityStatistics.averageSetsPerActivity.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.averageSetsPerActivity.dynamics) }}</sup
          >,
        </span>
        <span
          >повторов в сете: {{ props.activityStatistics.averageRepeatsPerSet.cur }}
          <sup
            :class="$style.dynamics"
            :data-positive="props.activityStatistics.averageRepeatsPerSet.dynamics > 0"
            :data-negative="props.activityStatistics.averageRepeatsPerSet.dynamics < 0"
            >{{ formatStatisticsPercent(props.activityStatistics.averageRepeatsPerSet.dynamics) }}</sup
          >,
        </span>
        <span
          >отдых: {{ props.activityStatistics.averageRestPercent.cur }}%
          <sup :class="$style.dynamics">{{
            formatStatisticsPercent(props.activityStatistics.averageRestPercent.dynamics)
          }}</sup></span
        >
      </div>
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { IActivityStatistics } from 'fitness-tracker-contracts';
import { UiFlex } from 'mhz-ui';
import { formatDuration } from 'mhz-helpers';

interface IProps {
  activityStatistics: IActivityStatistics;
}

const props = defineProps<IProps>();

function formatStatisticsPercent(percent: number) {
  return percent === null ? '' : `${percent > 0 ? `+` : ``}${percent}%`;
}
</script>

<style module lang="scss">
.dynamics {
  font-size: 0.875rem;
  color: var(--color-gray-dark-extra);

  &[data-positive='true'] {
    color: var(--color-success-dark);
  }

  &[data-negative='true'] {
    color: var(--color-error-dark);
  }
}
</style>
