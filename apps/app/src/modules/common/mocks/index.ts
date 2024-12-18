import { ref, computed } from 'vue';
import { vi } from 'vitest';
import type { UseQueryReturnType, UseMutationReturnType } from 'mhz-helpers';

import LayoutDefault from '@/common/components/LayoutDefault.vue';

import * as commonComposables from '@/common/composables';

const layoutComponent = computed(() => LayoutDefault);

export function mockQueryReply<T>(reply: object, refetch?: () => void) {
  return { data: ref(reply), refetch, isSuccess: true } as unknown as UseQueryReturnType<T, Error>;
}

export function mockMutationReply<T, T2>(mutate: () => void) {
  return { mutate } as unknown as UseMutationReturnType<T, Error, T2, unknown>;
}

export const isLoaded = ref(false);

export const spyUseLayout = vi.spyOn(commonComposables, 'useLayout').mockImplementation(() => {
  return { isLoaded, layoutComponent };
});

export const layoutDefaultName = LayoutDefault.name;
