<template>
  <h1>{{ t('error') }}</h1>
</template>

<script setup lang="ts">
import { useTI18n } from '@/common/composables';

const { t } = useTI18n();
</script>
