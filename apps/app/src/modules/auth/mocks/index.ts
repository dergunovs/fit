import { vi } from 'vitest';

import * as authComposables from '@/auth/composables';

export const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockReturnValue();
