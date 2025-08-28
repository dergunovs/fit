<template>
  <UiTable :headers="EQUIPMENT_LIST_HEADERS" :isLoading="!props.equipments?.length" :lang="locale">
    <tr v-for="equipment in props.equipments" :key="equipment._id" data-test="equipment-table-row">
      <td data-grow>
        <RouterLink :to="`${URL_EQUIPMENT_EDIT}/${equipment._id}`" data-test="equipment-table-title-link">
          {{ equipment.title }}<span v-if="equipment.title_en"> ({{ equipment.title_en }})</span>
        </RouterLink>
      </td>
    </tr>
  </UiTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DefaultLocaleMessageSchema, useI18n } from 'vue-i18n';
import { UiTable } from 'mhz-ui';
import { IEquipment, TLocale } from 'fitness-tracker-contracts';

import { URL_EQUIPMENT_EDIT } from '@/equipment/constants';

interface IProps {
  equipments?: IEquipment[];
}

const props = defineProps<IProps>();

const { t, locale } = useI18n<DefaultLocaleMessageSchema, TLocale>();

const EQUIPMENT_LIST_HEADERS = computed(() => [{ title: t('title') }]);
</script>
