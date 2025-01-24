<template>
  <UiModal v-model="needRefresh" width="380">
    <UiFlex column>
      <div>Обновите страницу, чтобы использовать последнюю версию приложения.</div>

      <UiButton @click="updateServiceWorker">Обновить</UiButton>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>
