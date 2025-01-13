import { watch } from 'vue';
import { getCookieToken, setAuth, setAuthHeader } from 'mhz-helpers';

import { authService } from '@/auth/services';
import { TOKEN_NAME } from '@/auth/constants';

export function useAuthCheck() {
  const cookieToken = getCookieToken(TOKEN_NAME);

  if (cookieToken) setAuthHeader(cookieToken);

  const { data: user } = authService.check({ enabled: !!cookieToken });

  watch(
    () => user.value,
    () => {
      if (user.value?._id) setAuth(true);
    }
  );

  return { user };
}
