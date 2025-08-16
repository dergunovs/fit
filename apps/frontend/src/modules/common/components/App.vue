<template>
  <div>
    <component
      v-if="isLoaded && isAuthChecked"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <PWAUpdateModal />
  </div>
</template>

<script setup lang="ts">
import PWAUpdateModal from '@/common/components/PWAUpdateModal.vue';

import { useLayout, useLocale } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { initLocale } = useLocale();

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin, isAuthChecked } = useAuthCheck();

initLocale();
</script>
