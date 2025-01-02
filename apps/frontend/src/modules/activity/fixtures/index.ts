import {
  IActivity,
  IExerciseDone,
  TGetActivitiesCalendarDTO,
  TGetActivitiesStatisticsDTO,
} from 'fitness-tracker-contracts';
import { EXERCISE_FIXTURE, EXERCISE_FIXTURE_2 } from '@/exercise/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';
import { IActivityCalendarEvent } from '@/activity/interface';

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
      },
      weight: 9,
      isToFailure: false,
      duration: 37,
      isDone: true,
    },
  ],
  isDone: true,
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
      _id: '1',
      title: 'Приседание',
      sets: 33,
      setsDynamics: 79,
      repeats: 554,
      repeatsDynamics: 85,
      averageDuration: 3.0523465703971118,
    },
    {
      _id: '2',
      title: 'Отжимание от пола',
      sets: 27,
      setsDynamics: 26,
      repeats: 324,
      repeatsDynamics: 6,
      averageDuration: 3.3333333333333335,
    },
    {
      _id: '3',
      title: 'Сгибание на скамье',
      sets: 22,
      setsDynamics: 59,
      repeats: 323,
      repeatsDynamics: 70,
      averageDuration: 4.352941176470588,
    },
  ],
};

export const ACTIVITY_CALENDAR_EVENTS: IActivityCalendarEvent<IExerciseDone>[] = [
  {
    _id: '1',
    start: new Date('2024-12-30T12:07:40.135Z'),
    end: null,
    title: '+',
    content: [
      {
        _id: '1',
        repeats: 12,
        exercise: {
          _id: '1',
          title: 'Название',
          createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
          muscleGroups: [{ _id: '1', title: 'Плечи' }],
        },
        weight: 9,
      },
      {
        _id: '2',
        repeats: 12,
        exercise: {
          _id: '1',
          title: 'Название',
          createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
          muscleGroups: [{ _id: '1', title: 'Плечи' }],
        },
        weight: 9,
      },
    ],
  },
  {
    _id: '2',
    start: new Date('2024-12-30T12:07:54.432Z'),
    end: new Date('2024-12-30T12:08:03.794Z'),
    title: '+',
    content: [
      {
        _id: '3',
        repeats: 13,
        exercise: {
          title: 'Новое!',
          _id: '2',
          createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
          muscleGroups: [{ _id: '1', title: 'Плечи' }],
        },
        weight: 9,
        isToFailure: false,
        duration: 2,
        isDone: true,
      },
      {
        _id: '4',
        repeats: 11,
        exercise: {
          title: 'Новое!',
          _id: '2',
          createdBy: { email: 'a@b.ru', _id: '1', name: 'Александр' },
          muscleGroups: [{ _id: '1', title: 'Плечи' }],
        },
        weight: 9,
        isToFailure: true,
        duration: 1,
        isDone: true,
      },
    ],
  },
];
