<template>
  <div>
    <EquipmentForm v-if="equipment" :equipment="equipment" data-test="equipment-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import EquipmentForm from '@/equipment/components/EquipmentForm.vue';

import { equipmentService } from '@/equipment/services';

const { id } = useRouteId('equipment');

const { data: equipment } = equipmentService.getOne({}, id);
</script>
