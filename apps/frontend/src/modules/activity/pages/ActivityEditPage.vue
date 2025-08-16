<template>
  <div>
    <ActivityInfo
      v-if="activity?.exercises && activity._id && activity.dateCreated"
      :id="activity._id"
      :start="activity.dateCreated"
      :end="activity.dateUpdated"
      :exercises="activity.exercises"
      data-test="activity-info"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { activityService } from '@/activity/services';

const { id } = useRouteId('activity');

const { data: activity } = activityService.getOne({ enabled: !!id.value }, id);
</script>
