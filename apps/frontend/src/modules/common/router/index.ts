import { createRouter, createWebHistory } from 'vue-router';
import { getCookieToken, logout, deleteAuthHeader } from 'mhz-helpers';

import { TOKEN_NAME, URL_SETUP } from '@/auth/constants';
import { URL_HOME } from '@/common/constants';
import { routes } from '@/common/router/routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (![URL_HOME, URL_SETUP].includes(to.path) && !getCookieToken(TOKEN_NAME)) {
    logout(URL_HOME, deleteAuthHeader, TOKEN_NAME);
  } else {
    next();
  }
});

export default router;
