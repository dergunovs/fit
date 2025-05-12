<template>
  <div :class="$style.layout">
    <TheHeader :isAdmin="props.isAdmin" />

    <div v-if="props.isAdmin" :class="$style.container" :data-auth="isAuth" data-test="layout-admin">
      <NavList :navItems="NAV_ITEMS" data-test="layout-admin-nav" />

      <main :class="$style.main" :data-auth="isAuth">
        <RouterView :class="$style.content" :data-auth="isAuth" />
      </main>
    </div>

    <NavList :navItems="BOTTOM_NAV_ITEMS" isBottom data-test="layout-admin-bottom-nav" />>
  </div>
</template>

<script setup lang="ts">
import { isAuth } from 'mhz-helpers';

import TheHeader from '@/common/components/TheHeader.vue';
import NavList from '@/common/components/NavList.vue';

import { useNavItems } from '@/common/composables';

interface IProps {
  isAdmin: boolean;
}

const props = defineProps<IProps>();

defineOptions({ name: 'LayoutAdmin' });

const { NAV_ITEMS, BOTTOM_NAV_ITEMS } = useNavItems();
</script>

<style module lang="scss">
@use '../styles/layout';
</style>
