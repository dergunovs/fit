<template>
  <component v-if="isLoaded" :is="layoutComponent" />
</template>

<script setup lang="ts">
import { getCookieToken, setAuthHeader } from 'mhz-helpers';

import { getAuth } from '@/auth/services';
import { TOKEN_NAME } from '@/auth/constants';
import { useLayout } from '@/common/composables';

const { isLoaded, layoutComponent } = useLayout();

const token = getCookieToken(TOKEN_NAME);

if (token) {
  setAuthHeader(token);
  getAuth();
}
</script>
