import { ref, computed } from 'vue';
import { vi } from 'vitest';

import LayoutDefault from '@/common/components/LayoutDefault.vue';

import * as commonComposables from '@/common/composables';
import { router } from '@/common/test';

const layoutComponent = computed(() => LayoutDefault);

export const isLoaded = ref(false);

export const spyUseLayout = vi.spyOn(commonComposables, 'useLayout').mockImplementation(() => {
  return { isLoaded, layoutComponent };
});

export const layoutDefaultName = LayoutDefault.name;

export const spyRouterPush = vi.spyOn(router, 'push');

export * from './helpers';
export * from './ui';