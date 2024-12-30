<template>
  <div>
    <ActivityPassingForm v-if="activity" :activity="activity" data-test="activity-exercise-form" />
  </div>
</template>

<script setup lang="ts">
import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { activityService } from '@/activity/services';
import { useRouteId } from '@/common/composables';

const { id } = useRouteId('activity');

const { data: activity } = activityService.getOne({}, id);
</script>
