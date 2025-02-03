<template>
  <nav :class="$style.nav">
    <NavItem v-for="item in NAV_ITEMS" :key="item.title" :navItem="item" data-test="nav-list-item" />
  </nav>
</template>

<script setup lang="ts">
import NavItem from '@/common/components/NavItem.vue';

import { NAV_ITEMS } from '@/common/constants';
</script>

<style module lang="scss">
.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 192px;
  height: calc(100dvh - 120px);
  padding: 24px 12px;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .nav {
    width: 60px;
    padding: 24px 8px;
    background-color: var(--color-gray-light);
  }
}
</style>
