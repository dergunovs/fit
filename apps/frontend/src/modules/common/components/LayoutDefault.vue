<template>
  <div :class="$style.layout">
    <TheHeader @showLogin="isShowLogin = true" :isAdmin="props.isAdmin" data-test="layout-default-header" />

    <div :class="$style.container">
      <main :class="$style.main">
        <RouterView :class="$style.content" />
      </main>

      <UiModal v-model="isShowLogin" width="360" data-test="layout-default-login-form-modal">
        <AuthForm @login="isShowLogin = false" data-test="layout-default-login-form" />
      </UiModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiModal } from 'mhz-ui';

import TheHeader from '@/common/components/TheHeader.vue';
import AuthForm from '@/auth/components/AuthForm.vue';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutDefault' });

const isShowLogin = ref(false);
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
