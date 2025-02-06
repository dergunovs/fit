<template>
  <div>
    <component
      v-if="isLoaded"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      :isShowInstallPWA="isShowInstallPWA"
      @install="isShowInstallPWAModal = true"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <PWAUpdateModal />

    <PWAInstallModal
      v-if="isShowInstallPWAModal"
      v-model="isShowInstallPWA"
      :installPWA="installPWA"
      data-test="app-pwa-install-modal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePWA } from 'mhz-helpers';

import PWAUpdateModal from '@/common/components/PWAUpdateModal.vue';
import PWAInstallModal from '@/common/components/PWAInstallModal.vue';

import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin } = useAuthCheck();

const { installPWA, isShowInstallPWA } = usePWA();

const isShowInstallPWAModal = ref(false);
</script>
