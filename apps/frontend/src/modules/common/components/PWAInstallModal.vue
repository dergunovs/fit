<template>
  <UiModal v-model="isShowInstallPWA" width="360" data-test="pwa-install-modal">
    <UiFlex column>
      <div>Установить приложение FiT на устройство?</div>

      <UiFlex>
        <UiButton @click="installPWA" data-test="pwa-install-submit">Установить</UiButton>
        <UiButton @click="isShowInstallPWA = false" layout="secondary" data-test="pwa-install-cancel">Отмена</UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { UiButton, UiFlex, UiModal } from 'mhz-ui';
import { usePWA } from 'mhz-helpers';

const { installPWA, isShowInstallPWA } = usePWA();
</script>
