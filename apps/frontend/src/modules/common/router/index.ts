import { createRouter, createWebHistory } from 'vue-router';
import { getCookieToken, logout, deleteAuthHeader } from 'mhz-helpers';

import { TOKEN_NAME } from '@/auth/constants';
import { GUEST_PAGES, URL_HOME } from '@/common/constants';
import { routes } from '@/common/router/routes';

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  if (!GUEST_PAGES.includes(to.path) && !getCookieToken(TOKEN_NAME)) {
    logout(URL_HOME, deleteAuthHeader, TOKEN_NAME);
  } else {
    next();
  }
});

export { router };
