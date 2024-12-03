<template>
  <div>
    <ActivityForm
      :copy="route.query.copy?.toString()"
      :exerciseStatistics="statistics?.exercise"
      :averageRestPercent="statistics?.activity.averageRestPercent.cur"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import ActivityForm from '@/activity/components/ActivityForm.vue';

import { getActivitiesStatistics } from '@/activity/services';

const route = useRoute();

const activityStatisticsGap = 21;

const { data: statistics } = getActivitiesStatistics(activityStatisticsGap);
</script>
