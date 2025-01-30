import IconExercise from '@/common/icons/exercise.svg?component';
import IconActivity from '@/common/icons/activity.svg?component';
import IconEquipment from '@/common/icons/weight.svg?component';
import IconUser from '@/common/icons/user.svg?component';
import IconShare from '@/common/icons/share.svg?component';
import IconProgress from '@/common/icons/to-failure.svg?component';

import { URL_USER } from '@/user/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';
import { URL_EQUIPMENT } from '@/equipment/constants';
import { INavItem } from '@/common/interface';
import { URL_SETUP } from '@/auth/constants';

export const HERO_BENEFITS = [
  'Простой способ улучшить здоровье и настроение',
  'Календарь с визуализацией каждого занятия',
  'Эффективные упражнения с оборудованием и без него',
  'Бесплатное приложение для Android и iOS',
];

export const APP_FEATURES = [
  {
    icon: IconProgress,
    title: 'Отслеживайте прогресс',
    text: 'Таблица со статистикой по каждому упражению. Графики с динамикой по занятиям, подходам, повторам и группам мышц.',
  },
  {
    icon: IconShare,
    title: 'Делитесь результатами',
    text: 'В один клик скопируйте полные данные по каждой выполненной тренировке в календаре, включая время каждого подхода.',
  },
  {
    icon: IconActivity,
    title: 'Планируйте тренировки',
    text: 'Повторите последнюю или любую другую тренировку. Расчет примерной длительности тренировки на основе вашей статистики.',
  },
];

export const NAV_ITEMS: INavItem[] = [
  { _id: '1', url: URL_EXERCISE, title: 'Упражнения', icon: IconExercise },
  { _id: '2', url: URL_ACTIVITY_ADMIN, title: 'Занятия', icon: IconActivity },
  { _id: '3', url: URL_EQUIPMENT, title: 'Оборудование', icon: IconEquipment },
  { _id: '4', url: URL_USER, title: 'Пользователи', icon: IconUser },
];

export const UPDATE_BUTTON_TEXT = 'Обновить';
export const CREATE_BUTTON_TEXT = 'Создать';

export const URL_HOME = '/';
export const URL_ERROR = '/404';

export const GUEST_PAGES = [URL_HOME, URL_SETUP];

export const API_NPMJS = 'https://registry.npmjs.org/fitness-tracker-frontend';
