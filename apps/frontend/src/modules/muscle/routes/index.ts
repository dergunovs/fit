import { URL_MUSCLE, URL_MUSCLE_CREATE, URL_MUSCLE_EDIT } from '@/muscle/constants';

export const muscleRoutes = [
  {
    path: URL_MUSCLE,
    name: 'MuscleList',
    component: () => import('@/muscle/pages/MuscleListPage.vue'),
    meta: { layout: 'admin' },
  },
  {
    path: URL_MUSCLE_CREATE,
    name: 'MuscleCreate',
    component: () => import('@/muscle/pages/MuscleCreatePage.vue'),
    meta: { layout: 'admin' },
  },
  {
    path: `${URL_MUSCLE_EDIT}/:muscle`,
    name: 'MuscleEdit',
    component: () => import('@/muscle/pages/MuscleEditPage.vue'),
    meta: { layout: 'admin' },
  },
];
