<template>
  <LayoutContainer />
</template>

<script setup lang="ts">
import LayoutContainer from '@/common/components/LayoutContainer.vue';

import { useLocale } from '@/common/composables';

const { initLocale } = useLocale();

initLocale();
</script>
