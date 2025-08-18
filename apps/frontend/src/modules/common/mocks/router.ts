import { vi } from 'vitest';

import { router } from '@/common/test';

export const spyRouterPush = vi.spyOn(router, 'push');
export const spyRouterGo = vi.spyOn(router, 'go');
export const spyRouterIsReady = vi.spyOn(router, 'isReady');
