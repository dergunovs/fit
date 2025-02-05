<template>
  <div :class="$style.layout">
    <TheHeader
      :isAdmin="props.isAdmin"
      @showLogin="isShowLogin = true"
      @showRegistration="isShowRegistration = true"
      data-test="layout-default-header"
    />

    <div :class="$style.container" :data-auth="isAuth">
      <main :class="$style.main" :data-auth="isAuth">
        <RouterView :class="$style.content" :data-auth="isAuth" />
      </main>

      <UiModal v-model="isShowLogin" width="360" data-test="layout-default-login-form-modal">
        <AuthForm @login="isShowLogin = false" @reset="isShowLogin = false" data-test="layout-default-login-form" />
      </UiModal>

      <UiModal v-model="isShowRegistration" width="360" data-test="layout-default-registration-form-modal">
        <RegistrationForm @register="isShowRegistration = false" data-test="layout-default-registration-form" />
      </UiModal>
    </div>

    <NavList
      v-if="isAuth && !route.path.includes(URL_ACTIVITY_EDIT)"
      :navItems="BOTTOM_NAV_ITEMS"
      isBottom
      data-test="layout-default-bottom-nav"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { UiModal } from 'mhz-ui';
import { isAuth } from 'mhz-helpers';

import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';
import AuthForm from '@/auth/components/AuthForm.vue';
import RegistrationForm from '@/auth/components/RegistrationForm.vue';

import { URL_ACTIVITY_EDIT } from '@/activity/constants';
import { BOTTOM_NAV_ITEMS } from '@/common/constants';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutDefault' });

const route = useRoute();

const isShowLogin = ref(false);
const isShowRegistration = ref(false);
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
