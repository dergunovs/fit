<template>
  <UiFlex column gap="64">
    <TheHero />
    <AppFeatures />
    <ScienceInfo @register="emit('register')" />
  </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'mhz-ui';

import TheHero from '@/common/components/TheHero.vue';
import AppFeatures from '@/common/components/AppFeatures.vue';
import ScienceInfo from '@/common/components/ScienceInfo.vue';

interface IEmit {
  register: [];
}

const emit = defineEmits<IEmit>();
</script>
