<template>
  <UiModal v-model="needRefresh" width="380">
    <UiFlex column>
      <div>Обновите страницу для использования последней версии приложения</div>

      <UiFlex>
        <UiButton @click="updateServiceWorker">Обновить</UiButton>
        <UiButton @click="needRefresh = false" layout="secondary">Отмена</UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>
