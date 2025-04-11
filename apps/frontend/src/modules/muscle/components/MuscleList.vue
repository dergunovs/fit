<template>
  <UiTable :headers="MUSCLE_LIST_HEADERS" :isLoading="!props.muscles?.length">
    <tr v-for="muscle in props.muscles" :key="muscle._id" data-test="muscle-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_MUSCLE_EDIT}/${muscle._id}`" data-test="muscle-table-title-link">
          {{ muscle.title }}<span v-if="muscle.title_en"> ({{ muscle.title_en }})</span>
        </RouterLink>
      </td>
      <td>
        <div :style="{ color: muscle.color }">{{ muscle.color }}</div>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { UiTable } from 'mhz-ui';
import { IMuscle } from 'fitness-tracker-contracts';

import { URL_MUSCLE_EDIT } from '@/muscle/constants';

interface IProps {
  muscles?: IMuscle[];
}

const props = defineProps<IProps>();

const { t } = useI18n();

const MUSCLE_LIST_HEADERS = computed(() => [{ title: t('muscle.many') }, { title: t('color') }]);
</script>
