<template>
  <RouterLink
    :to="props.navItem.url"
    :class="$style.item"
    :data-active="isLinkActive(route.path, props.navItem.url)"
    :data-bottom="props.isBottom"
    data-test="nav-item"
  >
    <component :is="props.navItem.icon" width="20" height="20" :class="$style.icon" data-test="nav-item-icon" />

    <span :class="$style.title" :data-bottom="props.isBottom" data-test="nav-item-title">
      {{ props.navItem.title }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import { isLinkActive } from '@/common/helpers';
import { INavItem } from '@/common/interface';

interface IProps {
  navItem: INavItem;
  isBottom?: boolean;
}

const props = defineProps<IProps>();

const route = useRoute();
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
  &[data-active='true'] {
    color: var(--color-white);
    background-color: var(--color-primary);
  }

  &[data-bottom='true'] {
    justify-content: center;
    padding: 8px;
    color: var(--color-gray-dark);

    &:hover,
    &[data-active='true'] {
      color: var(--color-white);
    }
  }
}

.icon {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .item {
    padding: 12px;

    &[data-bottom='true'] {
      gap: 4px;
      padding: 4px;
    }
  }

  .title {
    &[data-bottom='false'] {
      display: none;
    }
  }
}
</style>
