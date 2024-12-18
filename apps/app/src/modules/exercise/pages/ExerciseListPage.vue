<template>
  <div>
    <UiFlex column gap="32">
      <RouterLink :to="URL_EXERCISE_CREATE">Добавить упражнение</RouterLink>

      <ExerciseList :exercises="exercises" />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import ExerciseList from '@/exercise/components/ExerciseList.vue';
import { exerciseService } from '@/exercise/services';
import { URL_EXERCISE_CREATE } from '@/exercise/constants';

const { data: exercises } = exerciseService.getAll();
</script>
