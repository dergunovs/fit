<template>
  <div>
    <UiFlex column gap="32">
      <RouterLink :to="URL_MUSCLE_CREATE" data-test="add-muscle">{{ t('muscle.add') }}</RouterLink>

      <MuscleList :muscles="muscles" data-test="muscle-list" />
    </UiFlex>
  </div>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import MuscleList from '@/muscle/components/MuscleList.vue';

import { muscleService } from '@/muscle/services';
import { URL_MUSCLE_CREATE } from '@/muscle/constants';
import { useTI18n } from '@/common/composables';

const { t } = useTI18n();

const { data: muscles } = muscleService.getAll();
</script>
