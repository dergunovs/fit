import { URL_USER, URL_USER_CREATE, URL_USER_EDIT } from '@/user/constants';

export const userRoutes = [
  {
    path: URL_USER,
    name: 'UserList',
    component: () => import('@/user/pages/UserListPage.vue'),
  },
  {
    path: URL_USER_CREATE,
    name: 'UserCreate',
    component: () => import('@/user/pages/UserCreatePage.vue'),
  },
  {
    path: `${URL_USER_EDIT}/:user`,
    name: 'UserEdit',
    component: () => import('@/user/pages/UserEditPage.vue'),
  },
];
