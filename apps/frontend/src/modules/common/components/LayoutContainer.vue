<template>
  <div>
    <TheHeader
      :isAdmin="isAdmin"
      :isAuthChecked="isAuthChecked"
      @showLogin="isShowLogin = true"
      @register="isShowRegistration = true"
      data-test="layout-header"
    />

    <div :class="$style.layout">
      <div :class="$style.wrapper" :data-auth="isAuth">
        <component
          v-if="isLoaded && isAuthChecked"
          @register="isShowRegistration = true"
          :is="layoutComponent"
          :data-layout="layoutComponent.name"
          data-test="layout"
        />
      </div>

      <NavList v-if="isAuth" :navItems="BOTTOM_NAV_ITEMS" isBottom data-test="layout-bottom-nav" />
    </div>

    <UiModal v-model="isShowLogin" data-test="layout-login-form-modal">
      <AuthForm @login="isShowLogin = false" @reset="isShowLogin = false" data-test="layout-login-form" />
    </UiModal>

    <UiModal v-model="isShowRegistration" data-test="layout-registration-form-modal">
      <RegistrationForm @register="isShowRegistration = false" data-test="layout-registration-form" />
    </UiModal>

    <PwaUpdateModal />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiModal } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';
import PwaUpdateModal from '@/common/components/PwaUpdateModal.vue';
import AuthForm from '@/auth/components/AuthForm.vue';
import RegistrationForm from '@/auth/components/RegistrationForm.vue';

import { useLayout, useNavItems } from '@/common/composables';
import { useAuthCheck } from '@/auth/composables';

const { isLoaded, layoutComponent } = useLayout();
const { isAdmin, isAuthChecked } = useAuthCheck();
const { BOTTOM_NAV_ITEMS } = useNavItems();

const isShowRegistration = ref(false);
const isShowLogin = ref(false);
</script>

<style module lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - env(safe-area-inset-top));
}

.wrapper {
  display: flex;
  height: calc(100dvh - var(--panel-height) - env(safe-area-inset-top));
  margin-top: calc(var(--panel-height) + env(safe-area-inset-top));
  overflow-y: auto;

  &[data-auth='true'] {
    height: calc(100dvh - var(--panel-height) * 2);
  }
}
</style>
