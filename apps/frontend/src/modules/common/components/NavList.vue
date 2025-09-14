<template>
  <nav :class="$style.nav" :data-bottom="props.isBottom">
    <NavItem
      v-for="item in props.navItems"
      :key="item.title"
      :navItem="item"
      :isBottom="props.isBottom"
      data-test="nav-list-item"
    />
  </nav>
</template>

<script setup lang="ts">
import NavItem from '@/common/components/NavItem.vue';

import { INavItem } from '@/common/interface';

interface IProps {
  navItems: INavItem[];
  isBottom?: boolean;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 192px;
  height: calc(100dvh - var(--panel-height) * 2);
  padding: 24px 12px;
  overflow-y: auto;

  &[data-bottom='true'] {
    position: fixed;
    bottom: 0;
    z-index: 1;
    flex-direction: row;
    width: 100%;
    height: var(--panel-height);
    padding: 8px 16px;
    color: var(--color-white);
    background-color: var(--color-primary-dark);
    border-top: 4px solid var(--color-accent);
  }
}

@media (max-width: 960px) {
  .nav {
    width: 60px;
    padding: 24px 8px;
    background-color: var(--color-gray-light);
  }
}

:global(.dark) {
  .nav {
    &[data-bottom='true'] {
      border-top: 4px solid var(--color-accent-dark);
    }
  }
}
</style>
