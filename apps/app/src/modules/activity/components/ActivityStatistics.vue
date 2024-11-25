<template>
  <div>
    <UiFlex column>
      <div>
        <b>Общие данные: </b>
        <span>длительность: {{ formatDuration(props.activityStatistics.duration) }}, </span>
        <span>занятия: {{ props.activityStatistics.activitiesCount }}, </span>
        <span>сеты: {{ props.activityStatistics.setsCount }}, </span>
        <span>повторы: {{ props.activityStatistics.repeatsCount }}.</span>
      </div>

      <div>
        <b>Средние значения: </b>
        <span>длительность: {{ formatDuration(props.activityStatistics.averageDuration) }}, </span>
        <span>сетов в занятии: {{ props.activityStatistics.averageSetsPerActivity }}, </span>
        <span>повторов в сете: {{ props.activityStatistics.averageRepeatsPerSet }}, </span>
        <span>отдых: {{ props.activityStatistics.averageRestPercent }}%.</span>
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
</script>
