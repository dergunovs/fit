<template>
  <header :class="$style.header">
    <UiFlex align="center" gap="64">
      <RouterLink :to="URL_HOME" :class="$style.logo" aria-label="Logo" data-test="header-logo">
        <IconLogo width="32" height="32" /> FiT
      </RouterLink>
    </UiFlex>

    <UiFlex gap="16" justify="flex-end">
      <template v-if="isAuth">
        <UiButton @click="router.push(URL_EXERCISE)" layout="plain" data-test="header-admin">Админка</UiButton>

        <UiButton @click="router.push(URL_ACTIVITY_CREATE)" layout="plain" data-test="header-activity">
          Занятие
        </UiButton>

        <UiButton @click="logout(URL_HOME, deleteAuthHeader, TOKEN_NAME)" layout="plain" data-test="header-logout">
          Выйти
        </UiButton>
      </template>

      <UiButton v-else @click="emit('showLogin')" layout="plain" data-test="header-login">Войти</UiButton>
    </UiFlex>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UiButton, UiFlex } from 'mhz-ui';
import { isAuth, logout, deleteAuthHeader } from 'mhz-helpers';

import IconLogo from '@/common/icons/logo.svg';

import { TOKEN_NAME } from '@/auth/constants';
import { URL_HOME } from '@/common/constants';
import { URL_ACTIVITY_CREATE } from '@/activity/constants';
import { URL_EXERCISE } from '@/exercise/constants';

const emit = defineEmits(['showLogin']);

const router = useRouter();
</script>

<style module lang="scss">
.header {
  position: fixed;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 16px 32px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray);
}

.logo {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  text-decoration: none;
}

@media (max-width: 960px) {
  .header {
    padding: 16px;
  }
}
</style>
