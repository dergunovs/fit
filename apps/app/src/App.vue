<template>
  <component v-if="isLoaded" :is="layoutComponent" data-test="layout" :data-layout="layoutComponent.name" />
</template>

<script setup lang="ts">
import { useLayout } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();

useAuthCheck();
</script>
