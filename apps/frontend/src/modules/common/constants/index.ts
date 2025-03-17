import IconExercise from '@/common/icons/exercise.svg?component';
import IconActivity from '@/common/icons/activity.svg?component';
import IconEquipment from '@/common/icons/weight.svg?component';
import IconUser from '@/common/icons/user.svg?component';
import IconShare from '@/common/icons/share.svg?component';
import IconProgress from '@/common/icons/to-failure.svg?component';

import { URL_USER, URL_USER_PROFILE } from '@/user/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { URL_ACTIVITY_ADMIN, URL_ACTIVITY_CREATE } from '@/activity/constants';
import { URL_EQUIPMENT } from '@/equipment/constants';
import { INavItem } from '@/common/interface';
import { URL_SETUP } from '@/auth/constants';

export const URL_HOME = '/';
export const URL_HELP = '/help';
export const URL_ERROR = '/404';

export const GUEST_PAGES = [URL_HOME, URL_HELP, URL_SETUP];

export const HERO_BENEFITS = [
  'Простой способ улучшить здоровье и настроение',
  'Календарь с планированием и визуализацией занятий',
  'Эффективные упражнения с оборудованием и без него',
  'Бесплатное приложение для Android и iOS',
];

export const APP_FEATURES = [
  {
    icon: IconProgress,
    title: 'Отслеживайте прогресс',
    text: 'Таблица со статистикой по упражениям. Графики с динамикой по занятиям, подходам, повторам и группам мышц.',
  },
  {
    icon: IconShare,
    title: 'Делитесь результатами',
    text: 'В один клик скопируйте данные по выполненной тренировке в календаре, включая время каждого подхода.',
  },
  {
    icon: IconActivity,
    title: 'Планируйте тренировки',
    text: 'Повторите одну из прошлых тренировок. Расчет длительности тренировки на основе вашей статистики.',
  },
];

export const UPDATE_BUTTON_TEXT = 'Сохранить';
export const CREATE_BUTTON_TEXT = 'Создать';

export const NAV_ITEMS: INavItem[] = [
  { url: URL_EXERCISE, title: 'Упражнения', icon: IconExercise },
  { url: URL_ACTIVITY_ADMIN, title: 'Занятия', icon: IconActivity },
  { url: URL_EQUIPMENT, title: 'Оборудование', icon: IconEquipment },
  { url: URL_USER, title: 'Пользователи', icon: IconUser },
];

export const BOTTOM_NAV_ITEMS: INavItem[] = [
  { url: URL_HOME, title: 'Статистика', icon: IconActivity },
  { url: URL_ACTIVITY_CREATE, title: 'Занятие', icon: IconExercise },
  { url: URL_USER_PROFILE, title: 'Профиль', icon: IconUser },
];
