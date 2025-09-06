<template>
  <UiModal v-model="needRefresh" data-test="pwa-update-modal">
    <UiFlex column gap="16">
      <div>
        <b>{{ t('pwa.updateApp') }}</b>
      </div>

      <div>{{ t('pwa.getNewVersion') }}?</div>

      <UiFlex>
        <UiButton @click="updateServiceWorker" data-test="pwa-update-submit">
          {{ t('update') }}
        </UiButton>

        <UiButton @click="needRefresh = false" layout="secondary" data-test="pwa-update-cancel">
          {{ t('cancel') }}
        </UiButton>
      </UiFlex>
    </UiFlex>
  </UiModal>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { UiButton, UiFlex, UiModal } from 'mhz-ui';

import { useTI18n } from '@/common/composables';

const { t } = useTI18n();
const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>
