<template>
  <div>
    <UiFlex column gap="32">
      <RouterLink :to="URL_EQUIPMENT_CREATE" data-test="add-equipment">Добавить оборудование</RouterLink>

      <EquipmentList :equipments="equipments" data-test="equipment-list" />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import EquipmentList from '@/equipment/components/EquipmentList.vue';
import { equipmentService } from '@/equipment/services';
import { URL_EQUIPMENT_CREATE } from '@/equipment/constants';

const { data: equipments } = equipmentService.getAll();
</script>
