<template>
  <UiModal v-model="needRefresh" width="360" data-test="pwa-update-modal">
    <UiFlex column gap="16">
      <div><b>Обновление приложения</b></div>

      <div v-if="isSameVersion">Обновите для получения нового контента.</div>

      <template v-else>
        <div>Текущая версия: {{ currentVersion }}.</div>

        <div>
          Обновить приложение до версии <span data-test="pwa-update-latest-version">{{ latestVersion }}</span
          >?
        </div>
      </template>

      <UiFlex>
        <UiButton @click="updateServiceWorker" data-test="pwa-update-submit">Обновить</UiButton>
        <UiButton @click="needRefresh = false" layout="secondary" data-test="pwa-update-cancel">Отмена</UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

import { commonService } from '@/common/services';

const { needRefresh, updateServiceWorker } = useRegisterSW();

const { data: latestVersion } = commonService.getLatestVersion();

const currentVersion = import.meta.env.VITE_VERSION;

const isSameVersion = computed(() => currentVersion === latestVersion.value);
</script>
