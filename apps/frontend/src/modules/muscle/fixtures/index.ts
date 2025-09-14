import { IMuscle } from 'fitness-tracker-contracts';

export const MUSCLE_FIXTURE: IMuscle = {
  title: 'Грудь',
  title_en: 'Chest',
  color: '#00CED1',
  _id: '67debc85e7b58ba56888a185',
  dateCreated: '2025-03-22T13:35:01.563Z',
};

export const MUSCLES_FIXTURE: IMuscle[] = [
  MUSCLE_FIXTURE,
  {
    title: 'Ноги',
    title_en: 'Legs',
    color: '#0000ff',
    _id: '67debcc6e7b58ba56888a196',
    dateCreated: '2025-03-22T13:36:06.250Z',
  },
  {
    title: 'Плечи',
    title_en: 'Shoulders',
    color: '#C41E3A',
    _id: '67debb25e7b58ba56888a169',
    dateCreated: '2025-03-22T13:29:09.510Z',
    dateUpdated: '2025-03-22T13:34:42.545Z',
  },
  {
    title: 'Пресс',
    title_en: 'Abs',
    color: '#32CD32',
    _id: '67debcabe7b58ba56888a189',
    dateCreated: '2025-03-22T13:35:39.305Z',
  },
  {
    title: 'Руки',
    title_en: 'Arms',
    color: '#DA70D6',
    _id: '67debc7ce7b58ba56888a182',
    dateCreated: '2025-03-22T13:34:52.039Z',
  },
  {
    title: 'Спина',
    title_en: 'Back',
    color: '#FF8C00',
    _id: '67debcb8e7b58ba56888a190',
    dateCreated: '2025-03-22T13:35:52.851Z',
  },
];
