import { TGetActivitiesCalendarDTO, TGetActivitiesStatisticsDTO } from 'fitness-tracker-contracts';
import { EXERCISE_FIXTURE, EXERCISE_FIXTURE_2 } from '@/exercise/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';

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
