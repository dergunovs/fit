import IconExercise from '@/common/icons/nav-exercise.svg?component';
import IconActivity from '@/common/icons/nav-activity.svg?component';
import IconEquipment from '@/common/icons/weight.svg?component';
import IconUser from '@/common/icons/nav-user.svg?component';

import { URL_USER } from '@/user/constants';
import { URL_EXERCISE } from '@/exercise/constants';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';
import { URL_EQUIPMENT } from '@/equipment/constants';
import { INavItem } from '@/common/interface';
import { URL_SETUP } from '@/auth/constants';

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
