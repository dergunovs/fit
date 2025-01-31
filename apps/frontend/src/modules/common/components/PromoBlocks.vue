<template>
  <UiFlex column gap="64">
    <TheHero />
    <AppFeatures />
    <ScienceInfo />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import TheHero from '@/common/components/TheHero.vue';
import AppFeatures from '@/common/components/AppFeatures.vue';
import ScienceInfo from '@/common/components/ScienceInfo.vue';
</script>
