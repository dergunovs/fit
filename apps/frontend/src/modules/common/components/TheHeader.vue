<template>
  <header :class="$style.header">
    <RouterLink :to="URL_HOME" :class="$style.link" aria-label="Logo" data-test="header-logo">
      <IconLogo width="30" height="30" />

      <UiFlex column gap="0">
        <div :class="$style.logo">FiT</div>
        <div :class="$style.version">v. {{ version }}</div>
      </UiFlex>
    </RouterLink>

    <UiFlex v-show="props.isAuthChecked" justify="flex-end" data-test="header-links">
      <UiButton @click="toggleDarkMode" layout="plain" data-test="header-dark-mode">
        <IconDarkMode />
      </UiButton>

      <UiButton @click="toggleLocale" layout="plain" data-test="header-locale">
        {{ locale.toUpperCase() }}
      </UiButton>

      <UiButton @click="router.push(URL_HELP)" layout="plain" data-test="header-help">
        {{ t('help') }}
      </UiButton>

      <template v-if="isAuth">
        <UiButton v-if="props.isAdmin" @click="router.push(URL_EXERCISE)" layout="plain" data-test="header-admin">
          {{ t('adminPanel') }}
        </UiButton>

        <UiButton @click="logout(URL_HOME, deleteAuthHeader, TOKEN_NAME)" layout="plain" data-test="header-logout">
          {{ t('exit') }}
        </UiButton>
      </template>

      <template v-else>
        <UiButton @click="emit('register')" layout="plain" data-test="header-registration">
          {{ t('registration') }}
        </UiButton>

        <UiButton @click="emit('showLogin')" layout="plain" data-test="header-login">
          {{ t('login') }}
        </UiButton>
      </template>
    </UiFlex>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { UiButton, UiFlex } from 'mhz-ui';
import { isAuth, logout, deleteAuthHeader, useDarkMode } from 'mhz-helpers';

import IconLogo from '@/common/icons/logo.svg';
import IconDarkMode from '@/common/icons/dark-mode.svg';

import { TOKEN_NAME } from '@/auth/constants';
import { URL_HOME, URL_HELP } from '@/common/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { useLocale, useTI18n } from '@/common/composables';

interface IProps {
  isAdmin: boolean;
  isAuthChecked: boolean;
}

interface IEmit {
  showLogin: [];
  register: [];
  install: [];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const router = useRouter();

const { t, locale } = useTI18n();
const { toggleLocale } = useLocale();
const { toggleDarkMode } = useDarkMode();

const version = import.meta.env.VITE_VERSION;
</script>

<style module lang="scss">
.header {
  position: fixed;
  top: env(safe-area-inset-top);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--panel-height);
  padding: 8px 32px;
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
  color: var(--color-black);
}

.version {
  padding-left: 2px;
  font-size: 0.75rem;
  line-height: 0.8;
  color: var(--color-gray-dark);
}

@media (max-width: 960px) {
  .header {
    padding: 8px 12px;
  }
}

:global(.dark) {
  .header {
    background-color: var(--color-black);
    border-bottom: 1px solid var(--color-gray-dark-extra);
  }

  .logo {
    color: var(--color-gray-light);
  }
}
</style>
