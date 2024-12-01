import { TActivityChartType } from 'fitness-tracker-contracts';

export const URL_ACTIVITY = '/activities';
export const URL_ACTIVITY_CREATE = `${URL_ACTIVITY}/create`;
export const URL_ACTIVITY_EDIT = `${URL_ACTIVITY}/edit`;

export const URL_ACTIVITY_ADMIN = '/activities_admin';
export const URL_ACTIVITY_ADMIN_EDIT = `${URL_ACTIVITY_ADMIN}/edit`;

export const ACTIVITY_STATISTICS_HEADERS = [{ title: 'Мышцы' }, { title: 'Сеты' }, { title: 'Повторы' }];
export const ACTIVITY_LIST_HEADERS = [{ title: 'Создано' }];

export const CHART_TYPES: { title: string; value: TActivityChartType }[] = [
  { title: 'Занятия', value: 'activity' },
  { title: 'Сеты', value: 'set' },
  { title: 'Повторы', value: 'repeat' },
];
