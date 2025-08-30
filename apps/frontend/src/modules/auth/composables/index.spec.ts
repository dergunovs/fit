import { describe, it, expect, vi, afterEach } from 'vitest';
import * as helpers from 'mhz-helpers';

import { useAuthCheck, setAdmin, isAdmin, isAuthChecked, setIsAuthChecked } from '.';

import { USER_FIXTURE } from '@/user/fixtures';
import { authService } from '@/auth/services';
import { mockQueryReply } from '@/common/mocks';
import { TOKEN_FIXTURE } from '@/auth/fixtures';
import { TOKEN_NAME } from '@/auth/constants';

const spyCheckAuth = vi.spyOn(authService, 'check').mockImplementation(() => mockQueryReply(USER_FIXTURE));
const spyGetCookieToken = vi.spyOn(helpers, 'getCookieToken').mockReturnValue(TOKEN_FIXTURE);

describe('useAuthCheck composables', () => {
  afterEach(() => {
    vi.clearAllMocks();
    setAdmin(false);
    setIsAuthChecked(false);
  });

  it('inits with token', async () => {
    await helpers.withSetup(async () => {
      expect(isAuthChecked.value).toBe(false);
      expect(isAdmin.value).toBe(false);
      expect(spyCheckAuth).toHaveBeenCalledTimes(0);
      expect(spyGetCookieToken).toHaveBeenCalledTimes(0);

      const { user } = useAuthCheck();

      expect(spyGetCookieToken).toHaveBeenCalledTimes(1);
      expect(spyGetCookieToken).toHaveBeenCalledWith(TOKEN_NAME);

      expect(spyCheckAuth).toHaveBeenCalledTimes(1);
      expect(spyCheckAuth).toHaveBeenCalledWith({ enabled: true });

      expect(user.value).toStrictEqual(USER_FIXTURE);
    });
  });

  it('inits without token', async () => {
    spyGetCookieToken.mockReturnValue(undefined);
    spyCheckAuth.mockImplementation(() => mockQueryReply());

    await helpers.withSetup(async () => {
      expect(isAuthChecked.value).toBe(false);
      expect(isAdmin.value).toBe(false);
      expect(spyCheckAuth).toHaveBeenCalledTimes(0);
      expect(spyGetCookieToken).toHaveBeenCalledTimes(0);

      const { user } = useAuthCheck();

      expect(spyGetCookieToken).toHaveBeenCalledTimes(1);
      expect(spyGetCookieToken).toHaveBeenCalledWith(TOKEN_NAME);

      expect(spyCheckAuth).toHaveBeenCalledTimes(1);
      expect(spyCheckAuth).toHaveBeenCalledWith({ enabled: false });

      expect(isAuthChecked.value).toBe(true);
      expect(user.value).toBeUndefined();
    });
  });

  it('sets admin permissions with setAdmin', () => {
    expect(isAdmin.value).toBe(false);

    setAdmin(true);

    expect(isAdmin.value).toBe(true);
  });

  it('sets is auth checked', () => {
    expect(isAuthChecked.value).toBe(false);

    setIsAuthChecked(true);

    expect(isAuthChecked.value).toBe(true);
  });
});
