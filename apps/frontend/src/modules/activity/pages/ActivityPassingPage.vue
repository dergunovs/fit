<template>
  <div>
    <ActivityPassingForm v-if="activity" :activity="activity" data-test="activity-exercise-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { activityService } from '@/activity/services';

const { id } = useRouteId('activity');

const { data: activity } = activityService.getOne({}, id);
</script>
