<template>
  <RouterLink :to="props.navItem.url" :class="$style.item">
    <component :is="props.navItem.icon" width="20" height="20" :class="$style.icon" />
    <span :class="$style.title">{{ props.navItem.title }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { INavItem } from '@/common/interface';

interface IProps {
  navItem: INavItem;
}

const props = defineProps<IProps>();
</script>

<style module lang="scss">
.item {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  color: var(--color-black);
  text-decoration: none;
  border-radius: 16px;

  &:hover,
  &:global(.router-link-active) {
    color: var(--color-white);
    background-color: var(--color-primary);
  }
}

.icon {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .item {
    padding: 12px;
  }

  .title {
    display: none;
  }
}
</style>
