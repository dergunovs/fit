<template>
  <div :class="$style.layout">
    <TheHeader @showLogin="isShowLogin = true" />

    <div :class="$style.container">
      <main :class="$style.main">
        <RouterView :class="$style.content" />
      </main>

      <UiModal v-model="isShowLogin">
        <AuthForm @login="isShowLogin = false" />
      </UiModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiModal } from 'mhz-ui';

import TheHeader from '@/layout/components/TheHeader.vue';
import AuthForm from '@/auth/components/AuthForm.vue';

defineOptions({ name: 'LayoutDefault' });

const isShowLogin = ref(false);
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
