<template>
  <UiTable :headers="EXERCISE_LIST_HEADERS" :isLoading="!props.exercises?.length" :lang="locale">
    <tr v-for="exercise in props.exercises" :key="exercise._id" data-test="exercise-table-row">
      <td data-grow>
        <RouterLink
          :to="`${URL_EXERCISE_EDIT}/${exercise._id}`"
          :class="$style.title"
          :data-custom="exercise.isCustom"
          data-test="exercise-table-title-link"
        >
          {{ exercise.title }}<span v-if="exercise.title_en"> ({{ exercise.title_en }})</span>
        </RouterLink>
      </td>
      <td>{{ exercise.createdBy?.name }}</td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { UiTable } from 'mhz-ui';
import { IExercise, TLocale } from 'fitness-tracker-contracts';

import { URL_EXERCISE_EDIT } from '@/exercise/constants';

interface IProps {
  exercises?: IExercise[];
}

const props = defineProps<IProps>();

const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const EXERCISE_LIST_HEADERS = computed(() => [{ title: t('title') }, { title: t('user.one') }]);
</script>

<style module lang="scss">
.title {
  &[data-custom='true'] {
    font-weight: 700;
  }
}
</style>
