<template>
  <UiFlex column gap="64">
    <TheHero />
    <AppFeatures />
    <MotivationInfo />
    <ScienceInfo />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import TheHero from '@/common/components/TheHero.vue';
import AppFeatures from '@/common/components/AppFeatures.vue';
import MotivationInfo from '@/common/components/MotivationInfo.vue';
import ScienceInfo from '@/common/components/ScienceInfo.vue';
</script>
