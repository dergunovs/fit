<template>
  <div>
    <TheHeader @showLogin="isShowLogin = true" @register="isShowRegistration = true" data-test="layout-header" />

    <div :class="$style.layout">
      <div :class="$style.wrapper" :data-auth="isAuth">
        <component
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
import { defineAsyncComponent, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { UiModal } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import LayoutDefault from '@/common/components/LayoutDefault.vue';
import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';
import PwaUpdateModal from '@/common/components/PwaUpdateModal.vue';

import { useNavItems } from '@/common/composables';

const LayoutAdmin = defineAsyncComponent(() => import('@/common/components/LayoutAdmin.vue'));
const AuthForm = defineAsyncComponent(() => import('@/auth/components/AuthForm.vue'));
const RegistrationForm = defineAsyncComponent(() => import('@/auth/components/RegistrationForm.vue'));

const route = useRoute();
const { BOTTOM_NAV_ITEMS } = useNavItems();

const isShowRegistration = shallowRef(false);
const isShowLogin = shallowRef(false);

const layoutComponent = shallowRef<typeof LayoutDefault | typeof LayoutAdmin>(LayoutDefault);

watch(
  () => route.meta.layout,
  () => {
    layoutComponent.value = route.meta.layout === 'admin' ? LayoutAdmin : LayoutDefault;
  }
);
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
