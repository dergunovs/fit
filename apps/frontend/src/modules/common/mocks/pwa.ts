import { ref } from 'vue';
import { vi } from 'vitest';

import * as pwaComposables from 'virtual:pwa-register/vue';
import * as commonComposables from '@/common/composables';
import { commonService } from '@/common/services';
import { mockQueryReply } from '@/common/mocks';
import { LATEST_VERSION_FIXTURE } from '@/common/fixtures';

const spyGetLatestVersion = vi
  .spyOn(commonService, 'getLatestVersion')
  .mockReturnValue(mockQueryReply(LATEST_VERSION_FIXTURE['dist-tags'].latest));

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
  spyGetLatestVersion,
  spyUsePWA,
  spyInstallPWA,
  spyUseRegisterSW,
  spyUpdateServiceWorker,
  mockIsShowInstallPWA,
  mockNeedRefresh,
  mockOfflineReady,
};
