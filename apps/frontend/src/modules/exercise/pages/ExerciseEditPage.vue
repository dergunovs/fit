<template>
  <div>
    <ExerciseForm v-if="exercise" :exercise="exercise" data-test="exercise-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import ExerciseForm from '@/exercise/components/ExerciseForm.vue';

import { exerciseService } from '@/exercise/services';

const { id } = useRouteId('exercise');

const { data: exercise } = exerciseService.getOne({}, id);
</script>
