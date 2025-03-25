<template>
  <div>
    <MuscleForm v-if="muscle" :muscle="muscle" isEdit data-test="muscle-form" />
  </div>
</template>

<script setup lang="ts">
import { useRouteId } from 'mhz-helpers';

import MuscleForm from '@/muscle/components/MuscleForm.vue';

import { muscleService } from '@/muscle/services';

const { id } = useRouteId('muscle');

const { data: muscle } = muscleService.getOne({}, id);
</script>
