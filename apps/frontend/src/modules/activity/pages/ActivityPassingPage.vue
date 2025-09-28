<template>
  <div>
    <ActivityPassingForm v-if="activity" :activity="activity" data-test="activity-passing-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId, usePageLock } from 'mhz-helpers';

import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { activityService } from '@/activity/services';

const { id } = useRouteId('activity');

usePageLock();

const { data: activity } = activityService.getOne({ enabled: !!id.value }, id);
</script>
