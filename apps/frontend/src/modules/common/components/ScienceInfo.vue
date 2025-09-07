<template>
  <UiFlex justify="center">
    <div :class="$style.container">
      <div :class="$style.header">{{ t('science.title') }}</div>

      <p>{{ t('science.text') }}</p>

      <p>{{ t('callToAction') }}</p>

      <div :class="$style.button">
        <UiButton @click="emit('register')" layout="gradient" isTall isLargeFont>{{ t('register') }}</UiButton>
      </div>
    </div>
  </UiFlex>
</template>

<script setup lang="ts">
import { UiButton, UiFlex } from 'mhz-ui';
import { useTI18n } from '@/common/composables';

interface IEmit {
  register: [];
}

const emit = defineEmits<IEmit>();

const { t } = useTI18n();
</script>

<style module lang="scss">
.container {
  width: 100%;
  max-width: 900px;
}

.header {
  margin-bottom: 12px;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.button {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
