import { ref, watch, readonly } from 'vue';
import { getCookieToken, setAuth, setAuthHeader } from 'mhz-helpers';

import { authService } from '@/auth/services';
import { TOKEN_NAME } from '@/auth/constants';

const isAdminStore = ref(false);
const isAuthCheckedStore = ref(false);

export function setAdmin(isAdmin: boolean) {
  isAdminStore.value = isAdmin;
}

export const isAdmin = readonly(isAdminStore);
export const isAuthChecked = readonly(isAuthCheckedStore);

export function useAuthCheck() {
  const cookieToken = getCookieToken(TOKEN_NAME);

  if (cookieToken) {
    setAuthHeader(cookieToken);
  } else {
    isAuthCheckedStore.value = true;
  }

  const { data: user, isSuccess } = authService.check({ enabled: !!cookieToken });

  watch(
    () => user.value,
    () => {
      if (user.value?._id) {
        setAuth(true);
        isAuthCheckedStore.value = isSuccess.value;
        if (user.value.role === 'admin') setAdmin(true);
      }
    }
  );

  return { user, isAdmin, isAuthChecked };
}
