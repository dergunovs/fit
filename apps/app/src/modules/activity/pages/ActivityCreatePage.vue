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

import { activityService } from '@/activity/services';
import { ACTIVITY_STATISTICS_GAP } from '@/activity/constants';

const route = useRoute();

const { data: statistics } = activityService.getStatistics(ACTIVITY_STATISTICS_GAP);
</script>
