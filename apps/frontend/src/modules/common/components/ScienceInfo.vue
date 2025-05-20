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
import { useI18n } from 'vue-i18n';
import { UiFlex } from 'mhz-ui';

const { t, tm, rt } = useI18n();
</script>

<style module lang="scss">
.header {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}
</style>
