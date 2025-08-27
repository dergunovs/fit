<template>
  <div>
    <component
      v-if="isLoaded && isAuthChecked"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <PwaUpdateModal />
  </div>
</template>

<script setup lang="ts">
import PwaUpdateModal from '@/common/components/PwaUpdateModal.vue';

import { useLayout, useLocale } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { initLocale } = useLocale();

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin, isAuthChecked } = useAuthCheck();

initLocale();
</script>
