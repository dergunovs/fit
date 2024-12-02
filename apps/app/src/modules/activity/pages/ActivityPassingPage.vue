<template>
  <div>
    <ActivityExerciseForm v-if="activity" :activity="activity" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import ActivityExerciseForm from '@/activity/components/ActivityExerciseForm.vue';

import { getActivity } from '@/activity/services';

const route = useRoute();

const activityId = computed(() => route.params.activity.toString());

const { data: activity } = getActivity({}, activityId);
</script>
