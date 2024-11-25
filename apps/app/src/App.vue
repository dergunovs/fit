<template>
  <div>
    <component v-if="isLoaded" :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCookieToken, setAuthHeader } from 'mhz-helpers';

import LayoutAdmin from '@/layout/components/LayoutAdmin.vue';
import LayoutEmpty from '@/layout/components/LayoutEmpty.vue';

import { checkAuth } from '@/auth/services';
import { TOKEN_NAME } from '@/auth/constants';

const route = useRoute();
const router = useRouter();

const isLoaded = ref(false);

const layoutComponent = computed(() => (route.meta.layout === 'empty' ? LayoutEmpty : LayoutAdmin));

const token = getCookieToken(TOKEN_NAME);

if (token) {
  setAuthHeader(token);

  checkAuth();
}

onMounted(async () => {
  await router.isReady();
  isLoaded.value = true;
});
</script>
