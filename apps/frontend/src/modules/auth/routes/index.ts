import { URL_SETUP } from '@/auth/constants';

export const authRoutes = [{ path: URL_SETUP, name: 'Setup', component: () => import('@/auth/pages/SetupPage.vue') }];
