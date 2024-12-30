<template>
  <div>
    <ActivityForm
      :exerciseStatistics="statistics?.exercise"
      :averageRestPercent="statistics?.activity.averageRestPercent.cur"
      data-test="activity-form"
    />
  </div>
</template>

<script setup lang="ts">
import ActivityForm from '@/activity/components/ActivityForm.vue';

import { activityService } from '@/activity/services';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';

const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);
</script>
