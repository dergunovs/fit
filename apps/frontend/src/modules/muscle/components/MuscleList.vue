<template>
  <UiTable :headers="MUSCLE_LIST_HEADERS" :isLoading="!props.muscles?.length">
    <tr v-for="muscle in props.muscles" :key="muscle._id" data-test="muscle-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_MUSCLE_EDIT}/${muscle._id}`" data-test="muscle-table-title-link">
          {{ muscle.title }}
        </RouterLink>
      </td>
      <td>
        <div :style="{ color: muscle.color }">{{ muscle.color }}</div>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { UiTable } from 'mhz-ui';
import { IMuscle } from 'fitness-tracker-contracts';

import { URL_MUSCLE_EDIT, MUSCLE_LIST_HEADERS } from '@/muscle/constants';

interface IProps {
  muscles?: IMuscle[];
}

const props = defineProps<IProps>();
</script>
