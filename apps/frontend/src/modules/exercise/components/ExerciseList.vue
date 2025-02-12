<template>
  <UiTable :headers="EXERCISE_LIST_HEADERS" :isLoading="!props.exercises?.length">
    <tr v-for="exercise in props.exercises" :key="exercise._id" data-test="exercise-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_EXERCISE_EDIT}/${exercise._id}`" data-test="exercise-table-title-link">
          {{ exercise.title }}
        </RouterLink>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { UiTable } from 'mhz-ui';
import { IExercise } from 'fitness-tracker-contracts';

import { URL_EXERCISE_EDIT, EXERCISE_LIST_HEADERS } from '@/exercise/constants';

interface IProps {
  exercises?: IExercise[];
}

const props = defineProps<IProps>();
</script>
