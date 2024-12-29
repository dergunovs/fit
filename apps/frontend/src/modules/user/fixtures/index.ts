import { IUser } from 'fitness-tracker-contracts';

export const USER_FIXTURE: IUser = {
  email: 'a@b.ru',
  _id: '1',
  role: 'admin',
  name: 'Александр',
};

export const USER_FIXTURE_2: IUser = {
  email: 'a2@b.ru',
  _id: '2',
  role: 'user',
  name: 'Иван',
};

export const USERS_FIXTURE: IUser[] = [USER_FIXTURE, USER_FIXTURE_2];
