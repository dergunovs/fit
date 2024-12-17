<template>
  <component v-if="isLoaded" :is="layoutComponent" data-test="layout" />
</template>

<script setup lang="ts">
import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

useAuthCheck();
</script>
