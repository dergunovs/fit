import { watch } from 'vue';
import { getCookieToken, setAuth, setAuthHeader } from 'mhz-helpers';

import { getAuth } from '@/auth/services';
import { TOKEN_NAME } from '@/auth/constants';

export function useAuthCheck() {
  const cookieToken = getCookieToken(TOKEN_NAME);

  if (cookieToken) setAuthHeader(cookieToken);

  const { data: token } = getAuth({ enabled: !!cookieToken });

  watch(
    () => token.value,
    () => {
      if (token.value?._id) setAuth(true);
    }
  );
}
