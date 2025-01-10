<template>
  <UiTable :headers="EQUIPMENT_LIST_HEADERS" :isLoading="!props.equipments?.length" lang="ru">
    <tr v-for="equipment in props.equipments" :key="equipment._id" data-test="equipment-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_EQUIPMENT_EDIT}/${equipment._id}`" data-test="equipment-table-title-link">
          {{ equipment.title }}
        </RouterLink>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { UiTable } from 'mhz-ui';
import { IEquipment } from 'fitness-tracker-contracts';

import { URL_EQUIPMENT_EDIT, EQUIPMENT_LIST_HEADERS } from '@/equipment/constants';

interface IProps {
  equipments?: IEquipment[];
}

const props = defineProps<IProps>();
</script>
