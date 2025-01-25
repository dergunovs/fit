<template>
  <div>
    <component
      v-if="isLoaded"
      :is="layoutComponent"
      :isAdmin="isAdmin"
      data-test="app-layout"
      :data-layout="layoutComponent.name"
    />

    <PwaUpdateModal />

    <PwaInstallModal :isAuth="isAuth" />
  </div>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import PwaUpdateModal from '@/common/components/PwaUpdateModal.vue';
import PwaInstallModal from '@/common/components/PwaInstallModal.vue';

import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin } = useAuthCheck();
</script>
