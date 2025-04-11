<template>
  <UiFlex column>
    <div v-for="(content, index) in tm('statisticsText')" :key="index">
      {{ rt(content) }}
    </div>
  </UiFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { UiFlex } from 'mhz-ui';

const { tm, rt } = useI18n();
</script>
