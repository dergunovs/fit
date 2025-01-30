<template>
  <UiFlex column gap="64">
    <TheHero />
    <AppFeatures />
    <MotivationInfo />
    <ExerciseScience />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import TheHero from '@/common/components/TheHero.vue';
import AppFeatures from '@/common/components/AppFeatures.vue';
import MotivationInfo from '@/common/components/MotivationInfo.vue';
import ExerciseScience from '@/common/components/ExerciseScience.vue';
</script>
