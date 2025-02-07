<template>
  <div>
    <component
      v-if="isLoaded"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      :installPWA="installPWA"
      :isShowInstallPWA="isShowInstallPWA"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <PWAUpdateModal />
  </div>
</template>

<script setup lang="ts">
import { usePWA } from 'mhz-helpers';

import PWAUpdateModal from '@/common/components/PWAUpdateModal.vue';

import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin } = useAuthCheck();

const { installPWA, isShowInstallPWA } = usePWA();
</script>
