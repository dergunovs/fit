<template>
  <div :class="$style.bottomNav">
    <NavItem v-for="item in BOTTOM_NAV_ITEMS" :key="item.title" :navItem="item" isBottom />
  </div>
</template>

<script setup lang="ts">
import NavItem from '@/common/components/NavItem.vue';

import { BOTTOM_NAV_ITEMS } from '@/common/constants';
</script>

<style module lang="scss">
.bottomNav {
  position: fixed;
  bottom: 0;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 64px;
  padding: 8px 16px;
  color: var(--color-white);
  background-color: var(--color-primary);
}
</style>
