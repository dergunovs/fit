<template>
  <header :class="$style.header">
    <RouterLink :to="URL_HOME" :class="$style.link" aria-label="Logo" data-test="header-logo">
      <IconLogo width="32" height="32" />

      <UiFlex column gap="0">
        <div :class="$style.logo">FiT</div>
        <div :class="$style.version">v. {{ version }}</div>
      </UiFlex>
    </RouterLink>

    <UiFlex gap="12" justify="flex-end">
      <template v-if="isAuth">
        <UiButton v-if="props.isAdmin" @click="router.push(URL_EXERCISE)" layout="plain" data-test="header-admin">
          Админка
        </UiButton>

        <UiButton @click="router.push(URL_ACTIVITY_CREATE)" layout="plain" data-test="header-activity">
          Занятие
        </UiButton>

        <UiButton @click="router.push(URL_USER_PROFILE)" layout="plain" data-test="header-profile">Профиль</UiButton>

        <UiButton @click="logout(URL_HOME, deleteAuthHeader, TOKEN_NAME)" layout="plain" data-test="header-logout">
          Выйти
        </UiButton>
      </template>

      <template v-else>
        <UiButton @click="emit('showRegistration')" layout="plain" data-test="header-registration">
          Регистрация
        </UiButton>

        <UiButton @click="emit('showLogin')" layout="plain" data-test="header-login">Вход</UiButton>
      </template>
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
import { URL_USER_PROFILE } from '@/user/constants';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ showLogin: []; showRegistration: [] }>();

const router = useRouter();

const version = import.meta.env.VITE_VERSION;
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

.link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary-dark);
}

.version {
  padding-left: 2px;
  font-size: 0.75rem;
  line-height: 1;
  color: var(--color-gray-dark-extra);
}

@media (max-width: 960px) {
  .header {
    padding: 16px;
  }
}
</style>
