import { IMuscleGroup } from 'fitness-tracker-contracts';

import ImageShoulders from '@/exercise/images/shoulders.png';
import ImageArms from '@/exercise/images/arms.png';
import ImageChest from '@/exercise/images/chest.png';
import ImageAbs from '@/exercise/images/abs.png';
import ImageBack from '@/exercise/images/back.png';
import ImageLegs from '@/exercise/images/legs.png';

export const URL_EXERCISE = '/exercises';
export const URL_EXERCISE_CREATE = `${URL_EXERCISE}/create`;
export const URL_EXERCISE_EDIT = `${URL_EXERCISE}/edit`;

export const EXERCISE_WEIGHT_OPTIONS = [9, 16];
export const EXERCISE_REPEATS_OPTIONS = [8, 10, 12, 15];

export const EXERCISE_STATISTICS_HEADERS = [{ title: 'Упражнение' }, { title: 'Сеты' }, { title: 'Повторы' }];
export const EXERCISE_LIST_HEADERS = [{ title: 'Название' }];

export const EXERCISE_MUSCLE_GROUPS: IMuscleGroup[] = [
  { _id: '1', title: 'Плечи', icon: ImageShoulders },
  { _id: '2', title: 'Руки', icon: ImageArms },
  { _id: '3', title: 'Грудь', icon: ImageChest },
  { _id: '4', title: 'Пресс', icon: ImageAbs },
  { _id: '5', title: 'Спина', icon: ImageBack },
  { _id: '6', title: 'Ноги', icon: ImageLegs },
];
