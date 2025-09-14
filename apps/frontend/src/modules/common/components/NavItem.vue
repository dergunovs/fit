<template>
  <RouterLink
    :to="props.navItem.url"
    :class="$style.item"
    :data-active="isLinkActive(route.path, props.navItem.url)"
    :data-disabled="route.path.includes(URL_ACTIVITY_EDIT)"
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
import { isLinkActive } from 'mhz-helpers';

import { INavItem } from '@/common/interface';
import { URL_ACTIVITY_EDIT } from '@/activity/constants';

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
    background-color: var(--color-primary-dark);
  }

  &[data-bottom='true'] {
    justify-content: center;
    padding: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-gray-dark);

    &:hover,
    &[data-active='true'] {
      color: var(--color-white);
    }

    &[data-disabled='true'] {
      pointer-events: none;
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
