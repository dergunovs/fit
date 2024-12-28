<template>
  <div>
    <ExerciseForm v-if="exercise" :exercise="exercise" data-test="exercise-form" />
  </div>
</template>

<script setup lang="ts">
import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { exerciseService } from '@/exercise/services';
import { useRouteId } from '@/common/composables';

const { id } = useRouteId('exercise');

const { data: exercise } = exerciseService.getOne(id);
</script>
