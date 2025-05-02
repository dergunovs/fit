<template>
  <UiFlex column gap="64">
    <UiFlex column>
      <div :class="$style.header">{{ t('science.title') }}</div>

      <div>
        <a
          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5977566/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >{{ t('science.researches') }}</a
        >
        <template v-for="content in tm('science.researchesText')">
          {{ rt(content) }}
        </template>
      </div>

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

.image {
  align-self: center;
  max-width: 80%;
}

@media (max-width: 960px) {
  .image {
    max-width: 100%;
  }
}
</style>
