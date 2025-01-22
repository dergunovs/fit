<template>
  <component
    v-if="isLoaded"
    :is="layoutComponent"
    :isAdmin="isAdmin"
    data-test="app-layout"
    :data-layout="layoutComponent.name"
  />
</template>

<script setup lang="ts">
import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

const { isAdmin } = useAuthCheck();
</script>
