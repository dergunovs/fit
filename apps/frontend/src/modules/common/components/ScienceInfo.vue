<template>
  <UiFlex column gap="64">
    <UiFlex column>
      <div :class="$style.header">{{ t('science.title') }}</div>

      <div>{{ t('science.researches') }}</div>

      <div v-for="(content, index) in tm('statisticsText')" :key="index">
        {{ rt(content) }}
      </div>
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';
import { useTI18n } from '@/common/composables';

const { t, tm, rt } = useTI18n();
</script>

<style module lang="scss">
.header {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}
</style>
