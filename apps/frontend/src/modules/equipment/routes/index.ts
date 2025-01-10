import { URL_EQUIPMENT, URL_EQUIPMENT_CREATE, URL_EQUIPMENT_EDIT } from '@/equipment/constants';

export const equipmentRoutes = [
  {
    path: URL_EQUIPMENT,
    name: 'EquipmentList',
    component: () => import('@/equipment/pages/EquipmentListPage.vue'),
    meta: { layout: 'admin' },
  },
  {
    path: URL_EQUIPMENT_CREATE,
    name: 'EquipmentCreate',
    component: () => import('@/equipment/pages/EquipmentCreatePage.vue'),
    meta: { layout: 'admin' },
  },
  {
    path: `${URL_EQUIPMENT_EDIT}/:equipment`,
    name: 'EquipmentEdit',
    component: () => import('@/equipment/pages/EquipmentEditPage.vue'),
    meta: { layout: 'admin' },
  },
];
