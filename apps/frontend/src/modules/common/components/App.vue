<template>
  <div>
    <component
      v-if="isLoaded"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <template v-if="!isDev">
      <PWAUpdateModal />
      <PWAInstallModal :isAuth="isAuth" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import PWAUpdateModal from '@/common/components/PWAUpdateModal.vue';
import PWAInstallModal from '@/common/components/PWAInstallModal.vue';

import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin } = useAuthCheck();

const isDev = import.meta.env.VITE_IS_DEV;
</script>
