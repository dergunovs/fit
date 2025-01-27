import { ref } from 'vue';
import { vi } from 'vitest';

import * as pwaComposables from 'virtual:pwa-register/vue';
import * as commonComposables from '@/common/composables';

const spyInstallPWA = vi.fn();
const mockIsShowInstallPWA = ref(true);

const spyUsePWA = vi.spyOn(commonComposables, 'usePWA').mockImplementation(() => {
  return { installPWA: spyInstallPWA, isShowInstallPWA: mockIsShowInstallPWA };
});

const spyUpdateServiceWorker = vi.fn();
const mockNeedRefresh = ref(true);
const mockOfflineReady = ref(true);

const spyUseRegisterSW = vi.spyOn(pwaComposables, 'useRegisterSW').mockImplementation(() => {
  return { updateServiceWorker: spyUpdateServiceWorker, needRefresh: mockNeedRefresh, offlineReady: mockOfflineReady };
});

export {
  spyUsePWA,
  spyInstallPWA,
  spyUseRegisterSW,
  spyUpdateServiceWorker,
  mockIsShowInstallPWA,
  mockNeedRefresh,
  mockOfflineReady,
};
