<template>
  <div>
    <UiFlex column gap="32">
      <RouterLink :to="URL_EXERCISE_CREATE" data-test="add-exercise">{{ t('exercise.add') }}</RouterLink>

      <ExerciseList :exercises="exercises" data-test="exercise-list" />

      <UiPagination
        v-show="exercises?.length"
        :page="page"
        :total="total"
        @update="(value: number) => setPage(setPaginationPage(value, page))"
        data-test="exercise-list-pagination"
      />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { UiFlex, UiPagination } from 'mhz-ui';
import { usePagination, usePageNumber } from 'mhz-helpers';

import ExerciseList from '@/exercise/components/ExerciseList.vue';

import { exerciseService } from '@/exercise/services';
import { URL_EXERCISE_CREATE } from '@/exercise/constants';

const { t } = useI18n();
const { page, setPage } = usePageNumber();

const { data } = exerciseService.getMany(page);

const { data: exercises, total, setPaginationPage } = usePagination(data);
</script>
