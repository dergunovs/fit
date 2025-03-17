import { ref } from 'vue';
import { vi } from 'vitest';

import * as pwaComposables from 'virtual:pwa-register/vue';

const spyUpdateServiceWorker = vi.fn();
const mockNeedRefresh = ref(true);
const mockOfflineReady = ref(true);

const spyUseRegisterSW = vi.spyOn(pwaComposables, 'useRegisterSW').mockImplementation(() => {
  return { updateServiceWorker: spyUpdateServiceWorker, needRefresh: mockNeedRefresh, offlineReady: mockOfflineReady };
});

export { spyUseRegisterSW, spyUpdateServiceWorker, mockNeedRefresh, mockOfflineReady };
