<template>
  <div>
    <ActivityExerciseForm v-if="activity" :activity="activity" />
  </div>
</template>

<script setup lang="ts">
import ActivityExerciseForm from '@/activity/components/ActivityExerciseForm.vue';

import { activityService } from '@/activity/services';
import { useRouteId } from '@/common/composables';

const { id } = useRouteId('activity');

const { data: activity } = activityService.getOne({}, id);
</script>
