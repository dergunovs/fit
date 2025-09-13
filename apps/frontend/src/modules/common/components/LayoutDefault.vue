<template>
  <div :class="$style.layout">
    <TheHeader
      :isAdmin="props.isAdmin"
      @showLogin="isShowLogin = true"
      @register="isShowRegistration = true"
      data-test="layout-default-header"
    />

    <div :class="$style.container" :data-auth="isAuth">
      <main :class="$style.main" :data-auth="isAuth">
        <RouterView
          @register="isShowRegistration = true"
          :class="$style.content"
          :data-auth="isAuth"
          data-test="layout-default-page"
        />
      </main>

      <UiModal v-model="isShowLogin" data-test="layout-default-login-form-modal">
        <AuthForm @login="isShowLogin = false" @reset="isShowLogin = false" data-test="layout-default-login-form" />
      </UiModal>

      <UiModal v-model="isShowRegistration" data-test="layout-default-registration-form-modal">
        <RegistrationForm @register="isShowRegistration = false" data-test="layout-default-registration-form" />
      </UiModal>
    </div>

    <NavList v-if="isAuth" :navItems="BOTTOM_NAV_ITEMS" isBottom data-test="layout-default-bottom-nav" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UiModal } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';
import AuthForm from '@/auth/components/AuthForm.vue';
import RegistrationForm from '@/auth/components/RegistrationForm.vue';

import { useNavItems } from '@/common/composables';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutDefault' });

const { BOTTOM_NAV_ITEMS } = useNavItems();

const isShowLogin = ref(false);
const isShowRegistration = ref(false);
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
