<template>
  <NavList :navItems="NAV_ITEMS" />

  <main :class="$style.main" :data-auth="isAuth">
    <RouterView :class="$style.content" :data-auth="isAuth" />
  </main>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import NavList from '@/common/components/NavList.vue';

import { useNavItems } from '@/common/composables';

defineOptions({ name: 'LayoutAdmin' });

const { NAV_ITEMS } = useNavItems();
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
