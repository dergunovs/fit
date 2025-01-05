import { ref, computed } from 'vue';
import { vi } from 'vitest';

import LayoutDefault from '@/common/components/LayoutDefault.vue';

import * as commonComposables from '@/common/composables';

const layoutComponent = computed(() => LayoutDefault);

const mockIsLoaded = ref(false);

const spyUseLayout = vi.spyOn(commonComposables, 'useLayout').mockImplementation(() => {
  return { isLoaded: mockIsLoaded, layoutComponent };
});

const mockLayoutDefaultName = LayoutDefault.name;

export { spyUseLayout, mockIsLoaded, mockLayoutDefaultName };
