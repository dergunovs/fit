<template>
  <UiModal v-model="needRefresh" width="360" data-test="pwa-update-modal">
    <UiFlex column gap="16">
      <div><b>Обновление</b></div>

      <div>Обновить приложение до версии {{ version }}?</div>

      <UiFlex>
        <UiButton @click="updateServiceWorker" data-test="pwa-update-submit">Обновить</UiButton>
        <UiButton @click="needRefresh = false" layout="secondary" data-test="pwa-update-cancel">Отмена</UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

const { needRefresh, updateServiceWorker } = useRegisterSW();

const version = import.meta.env.VITE_VERSION;
</script>
