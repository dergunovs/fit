import {
  IActivity,
  IExerciseDone,
  TGetActivitiesCalendarDTO,
  TGetActivitiesChartDTO,
  TGetActivitiesStatisticsDTO,
} from 'fitness-tracker-contracts';
import { EXERCISE_FIXTURE, EXERCISE_FIXTURE_2 } from '@/exercise/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';
import { IActivityCalendarEvent } from '@/activity/interface';
import { mockTempId } from '@/common/mocks';

export const ACTIVITY_FIXTURE: IActivity = {
  exercises: [
    {
      repeats: 8,
      _id: '677142a9b34c976f4269d6b2',
      exercise: {
        title: 'Подтягивание прямым хватом',
        _id: '6717def846b2ab2ee5d4e8ab',
        createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
        muscleGroups: [
          { _id: '2', title: 'Руки' },
          { _id: '5', title: 'Спина' },
          { _id: '1', title: 'Плечи' },
        ],
        isWeights: true,
        isWeightsRequired: false,
      },
      weight: 0,
      isToFailure: false,
      duration: 42,
      isDone: true,
    },
    {
      repeats: 6,
      _id: '677142a9b34c976f4269d6b3',
      exercise: {
        title: 'Подтягивание прямым хватом',
        _id: '6717def846b2ab2ee5d4e8ab',
        createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
        muscleGroups: [
          { _id: '2', title: 'Руки' },
          { _id: '5', title: 'Спина' },
          { _id: '1', title: 'Плечи' },
        ],
        isWeights: true,
        isWeightsRequired: false,
      },
      weight: 0,
      isToFailure: false,
      duration: 43,
      isDone: true,
    },
    {
      repeats: 15,
      _id: '677142a9b34c976f4269d6b4',
      exercise: {
        title: 'Отжимание от пола',
        _id: '671e14aa66531a0a9c8a4435',
        createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
        muscleGroups: [
          { _id: '1', title: 'Плечи' },
          { _id: '2', title: 'Руки' },
          { _id: '3', title: 'Грудь' },
        ],
        isWeights: false,
        isWeightsRequired: false,
      },
      weight: 0,
      isToFailure: false,
      duration: 41,
      isDone: true,
    },
  ],
  isDone: true,
  _id: '123123',
  dateCreated: '2024-12-29T12:38:01.406Z',
  dateUpdated: '2024-12-29T13:40:01.456Z',
  createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
};

export const ACTIVITY_FIXTURE_2: IActivity = {
  exercises: [
    {
      repeats: 12,
      _id: '67691f4dd934e8f2ec643947',
      exercise: {
        title: 'Разведение рук лёжа на спине',
        _id: '671e22e0954dbe8ca19617f0',
        createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
        muscleGroups: [{ _id: '3', title: 'Грудь' }],
        isWeights: true,
        isWeightsRequired: true,
      },
      weight: 9,
      isToFailure: false,
      duration: 52,
      isDone: true,
    },
    {
      repeats: 12,
      _id: '67691f4dd934e8f2ec64394c',
      exercise: {
        title: 'Разведение рук стоя',
        _id: '671e1849954dbe8ca196175f',
        createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
        muscleGroups: [{ _id: '1', title: 'Плечи' }],
        isWeights: true,
        isWeightsRequired: true,
      },
      weight: 9,
      isToFailure: false,
      duration: 37,
      isDone: true,
    },
  ],
  isDone: false,
  _id: '321321',
  dateCreated: '2024-12-23T08:29:01.628Z',
  dateUpdated: '2024-12-23T09:21:48.779Z',
  createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
};

export const ACTIVITIES_FIXTURE: IActivity[] = [ACTIVITY_FIXTURE, ACTIVITY_FIXTURE_2];

export const ACTIVITIES_CALENDAR_FIXTURE: TGetActivitiesCalendarDTO = [
  {
    _id: '1',
    exercises: [
      {
        repeats: 15,
        _id: '1',
        exercise: EXERCISE_FIXTURE,
        weight: 0,
        isToFailure: true,
        duration: 50,
        isDone: true,
      },
      {
        repeats: 12,
        _id: '2',
        exercise: EXERCISE_FIXTURE_2,
        weight: 9,
        isToFailure: false,
        duration: 40,
        isDone: true,
      },
    ],
    isDone: true,
    dateCreated: '2024-11-30T07:30:57.304Z',
    dateUpdated: '2024-11-30T07:32:19.932Z',
    createdBy: USER_FIXTURE,
  },
  {
    _id: '2',
    exercises: [
      {
        repeats: 3,
        _id: '1',
        exercise: EXERCISE_FIXTURE,
        weight: 0,
        isToFailure: false,
        duration: 31,
        isDone: true,
      },
      {
        repeats: 12,
        _id: '2',
        exercise: EXERCISE_FIXTURE_2,
        weight: 0,
        isToFailure: false,
        duration: 44,
        isDone: true,
      },
    ],
    isDone: true,
    dateCreated: '2024-11-30T07:33:57.304Z',
    dateUpdated: '2024-11-30T07:36:19.932Z',
    createdBy: USER_FIXTURE,
  },
];

export const ACTIVITIES_STATISTICS_FIXTURE: TGetActivitiesStatisticsDTO = {
  activity: {
    activitiesCount: { cur: 10, dynamics: 20 },
    setsCount: { cur: 251, dynamics: 17 },
    repeatsCount: { cur: 3153, dynamics: 24 },
    duration: { cur: 23221, dynamics: 10 },
    averageSetsPerActivity: { cur: 25, dynamics: -4 },
    averageRepeatsPerSet: { cur: 13, dynamics: 15 },
    averageDuration: { cur: 2322, dynamics: -13 },
    averageRestPercent: { cur: 49, dynamics: 2 },
  },
  exercise: [
    {
      exercise: EXERCISE_FIXTURE,
      sets: 33,
      setsDynamics: 79,
      repeats: 554,
      repeatsDynamics: 85,
      averageDuration: 3.0523465703971118,
      isUserEquipmentMatches: false,
    },
    {
      exercise: EXERCISE_FIXTURE_2,
      sets: 27,
      setsDynamics: 26,
      repeats: 324,
      repeatsDynamics: 6,
      averageDuration: 3.3333333333333335,
      isUserEquipmentMatches: false,
    },
  ],
};

export const ACTIVITY_CALENDAR_EVENTS: IActivityCalendarEvent<IExerciseDone>[] = [
  {
    _id: '1',
    color: 'linear-gradient(135deg, #ff1818 36%, #a83cff 72%, #00f7e3 100%)',
    content: [
      {
        _id: '1',
        duration: 50,
        exercise: {
          _id: '1',
          createdBy: {
            _id: '15546435',
            email: 'a@b.ru',
            equipments: [
              {
                equipment: {
                  _id: '147456456',
                  dateCreated: '2025-01-09T15:01:04.310Z',
                  dateUpdated: '2025-01-10T10:42:06.333Z',
                  isWeights: true,
                  title: 'Гантели',
                },
                weights: [1, 2, 3],
              },
              {
                equipment: {
                  _id: '245645645645',
                  dateCreated: '2025-01-10T12:35:59.559Z',
                  isWeights: false,
                  title: 'Скамья',
                },
                weights: [],
              },
            ],
            name: 'Александр',
            role: 'admin',
          },
          description: 'Описание 1',
          equipment: {
            _id: '245645645645',
            dateCreated: '2025-01-10T12:35:59.559Z',
            isWeights: false,
            title: 'Скамья',
          },
          equipmentForWeight: [
            {
              _id: '147456456',
              dateCreated: '2025-01-09T15:01:04.310Z',
              dateUpdated: '2025-01-10T10:42:06.333Z',
              isWeights: true,
              title: 'Гантели',
            },
          ],
          isWeights: true,
          isWeightsRequired: true,
          muscleGroups: [
            { _id: '1', title: 'Плечи', color: '#ff1818' },
            { _id: '2', title: 'Руки', color: '#a83cff' },
          ],
          title: 'Отжимание от скамьи',
        },
        isDone: true,
        isToFailure: true,
        repeats: 15,
        weight: 0,
      },
      {
        _id: '2',
        duration: 40,
        exercise: {
          _id: '2',
          createdBy: {
            _id: '15546435',
            email: 'a@b.ru',
            equipments: [
              {
                equipment: {
                  _id: '147456456',
                  dateCreated: '2025-01-09T15:01:04.310Z',
                  dateUpdated: '2025-01-10T10:42:06.333Z',
                  isWeights: true,
                  title: 'Гантели',
                },
                weights: [1, 2, 3],
              },
              {
                equipment: {
                  _id: '245645645645',
                  dateCreated: '2025-01-10T12:35:59.559Z',
                  isWeights: false,
                  title: 'Скамья',
                },
                weights: [],
              },
            ],
            name: 'Александр',
            role: 'admin',
          },
          description: 'Описание 2',
          isWeights: false,
          isWeightsRequired: false,
          muscleGroups: [
            { _id: '3', title: 'Грудь', color: '#00f7e3' },
            { _id: '4', title: 'Пресс', color: '#00a934' },
          ],
          title: 'Подтягивание',
        },
        isDone: true,
        isToFailure: false,
        repeats: 12,
        weight: 9,
      },
    ],
    end: new Date('2024-11-30T07:32:19.932Z'),
    start: new Date('2024-11-30T07:30:57.304Z'),
    title: '+',
  },
  {
    _id: '2',
    color: 'linear-gradient(135deg, #00f7e3 44%, #00a934 88%, #ff1818 99%)',
    content: [
      {
        _id: '1',
        duration: 31,
        exercise: {
          _id: '1',
          createdBy: {
            _id: '15546435',
            email: 'a@b.ru',
            equipments: [
              {
                equipment: {
                  _id: '147456456',
                  dateCreated: '2025-01-09T15:01:04.310Z',
                  dateUpdated: '2025-01-10T10:42:06.333Z',
                  isWeights: true,
                  title: 'Гантели',
                },
                weights: [1, 2, 3],
              },
              {
                equipment: {
                  _id: '245645645645',
                  dateCreated: '2025-01-10T12:35:59.559Z',
                  isWeights: false,
                  title: 'Скамья',
                },
                weights: [],
              },
            ],
            name: 'Александр',
            role: 'admin',
          },
          description: 'Описание 1',
          equipment: {
            _id: '245645645645',
            dateCreated: '2025-01-10T12:35:59.559Z',
            isWeights: false,
            title: 'Скамья',
          },
          equipmentForWeight: [
            {
              _id: '147456456',
              dateCreated: '2025-01-09T15:01:04.310Z',
              dateUpdated: '2025-01-10T10:42:06.333Z',
              isWeights: true,
              title: 'Гантели',
            },
          ],
          isWeights: true,
          isWeightsRequired: true,
          muscleGroups: [
            { _id: '1', title: 'Плечи', color: '#ff1818' },
            { _id: '2', title: 'Руки', color: '#a83cff' },
          ],
          title: 'Отжимание от скамьи',
        },
        isDone: true,
        isToFailure: false,
        repeats: 3,
        weight: 0,
      },
      {
        _id: '2',
        duration: 44,
        exercise: {
          _id: '2',
          createdBy: {
            _id: '15546435',
            email: 'a@b.ru',
            equipments: [
              {
                equipment: {
                  _id: '147456456',
                  dateCreated: '2025-01-09T15:01:04.310Z',
                  dateUpdated: '2025-01-10T10:42:06.333Z',
                  isWeights: true,
                  title: 'Гантели',
                },
                weights: [1, 2, 3],
              },
              {
                equipment: {
                  _id: '245645645645',
                  dateCreated: '2025-01-10T12:35:59.559Z',
                  isWeights: false,
                  title: 'Скамья',
                },
                weights: [],
              },
            ],
            name: 'Александр',
            role: 'admin',
          },
          description: 'Описание 2',
          isWeights: false,
          isWeightsRequired: false,
          muscleGroups: [
            { _id: '3', title: 'Грудь', color: '#00f7e3' },
            { _id: '4', title: 'Пресс', color: '#00a934' },
          ],
          title: 'Подтягивание',
        },
        isDone: true,
        isToFailure: false,
        repeats: 12,
        weight: 0,
      },
    ],
    end: new Date('2024-11-30T07:36:19.932Z'),
    start: new Date('2024-11-30T07:33:57.304Z'),
    title: '+',
  },
];

export const ACTIVITIES_CHART_FIXTURE: TGetActivitiesChartDTO = {
  labels: [
    '18.11 - 24.11',
    '25.11 - 01.12',
    '02.12 - 08.12',
    '09.12 - 15.12',
    '16.12 - 22.12',
    '23.12 - 29.12',
    '30.12 - 05.01',
  ],
  datasets: [
    {
      data: [2, 3, 4, 3, 2, 3, 1],
      label: 'Занятия',
    },
  ],
};

export const EXERCISES_GENERATED = [
  {
    _id: mockTempId,
    exercise: {
      _id: '1',
      title: 'Отжимание от скамьи',
      muscleGroups: [
        { _id: '1', title: 'Плечи', color: '#ff1818' },
        { _id: '2', title: 'Руки', color: '#a83cff' },
      ],
      isWeights: true,
      isWeightsRequired: true,
    },
    repeats: 12,
    weight: 8,
  },
  {
    _id: mockTempId,
    exercise: {
      _id: '2',
      title: 'Подтягивание',
      muscleGroups: [
        { _id: '3', title: 'Грудь', color: '#00f7e3' },
        { _id: '4', title: 'Пресс', color: '#00a934' },
      ],
      isWeights: false,
      isWeightsRequired: false,
    },
    repeats: 12,
    weight: 0,
  },
];
