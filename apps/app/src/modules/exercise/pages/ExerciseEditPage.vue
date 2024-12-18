<template>
  <div>
    <ExerciseForm v-if="exercise" :exercise="exercise" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { exerciseService } from '@/exercise/services';

const route = useRoute();

const exerciseId = computed(() => route.params.exercise.toString());

const { data: exercise } = exerciseService.getOne(exerciseId);
</script>
