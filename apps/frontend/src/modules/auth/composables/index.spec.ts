import { describe, it, expect, vi, afterEach } from 'vitest';
import { withSetup } from 'mhz-helpers';

import { useAuthCheck, setAdmin, isAdmin, isAuthChecked } from '.';

import { spyCheckAuth } from '@/auth/mocks';
import { USER_FIXTURE } from '@/user/fixtures';

describe('useAuthCheck composables', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('inits', () => {
    withSetup(() => {
      expect(isAuthChecked.value).toBe(false);
      expect(spyCheckAuth).toHaveBeenCalledTimes(0);

      const { user } = useAuthCheck();

      expect(isAdmin.value).toBe(false);
      expect(user.value).toStrictEqual(USER_FIXTURE);
    });
  });

  it('sets admin permissions with setAdmin', () => {
    expect(isAdmin.value).toBe(false);

    setAdmin(true);

    expect(isAdmin.value).toBe(true);
  });
});
