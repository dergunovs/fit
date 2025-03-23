import { IUser } from 'fitness-tracker-contracts';

import { EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';

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
};

export const USER_FIXTURE_2: IUser = {
  email: 'a2@b.ru',
  _id: '264564564',
  role: 'user',
  name: 'Иван',
  equipments: [],
};

export const USERS_FIXTURE: IUser[] = [USER_FIXTURE, USER_FIXTURE_2];
