import { IUser, IUserFeedback, IUserTemplate } from 'fitness-tracker-contracts';

import { EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';
import { EXERCISE_REPEATS_DEFAULT } from '@/exercise/constants';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

export const USER_TEMPLATE: IUserTemplate = {
  _id: 'dgoeg1ger',
  title: 'Заголовок шаблона',
  exercises: [
    {
      _id: '1',
      weight: 0,
      repeats: EXERCISE_REPEATS_DEFAULT,
      exercise: {
        _id: '1',
        title: 'Отжимание от скамьи',
        title_en: 'Bench Press',
        description: 'Описание 1',
        createdBy: { email: 'a@b.ru', _id: '15546435' },
        muscles: [MUSCLES_FIXTURE[0], MUSCLES_FIXTURE[1]],
        isWeights: true,
        isWeightsRequired: true,
        equipment: EQUIPMENT_FIXTURE_2,
        equipmentForWeight: [EQUIPMENT_FIXTURE],
      },
    },
  ],
};

export const USER_FIXTURE: IUser = {
  email: 'a@b.ru',
  _id: '15546435',
  role: 'admin',
  name: 'Александр',
  equipments: [
    { equipment: EQUIPMENT_FIXTURE, weights: [1, 2, 3] },
    { equipment: EQUIPMENT_FIXTURE_2, weights: [] },
  ],
  defaultWeights: {
    '1': 1,
    '2': 0,
    '3': 1,
  },
  templates: [USER_TEMPLATE],
  goalActivities: 2,
  goalSets: 24,
  goalRepeats: 12,
  goalDuration: 40,
};

export const USER_FIXTURE_2: IUser = {
  email: 'a2@b.ru',
  _id: '264564564',
  role: 'user',
  name: 'Иван',
  equipments: [],
};

export const USERS_FIXTURE: IUser[] = [USER_FIXTURE, USER_FIXTURE_2];

export const USER_FEEDBACK: IUserFeedback = {
  name: 'Иван',
  email: 'a@b.ru',
  message: 'Привет',
};
