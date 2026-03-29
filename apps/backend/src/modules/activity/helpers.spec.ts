import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockExercise, mockExercise2 } from '../exercise/mocks.ts';
import { mockMuscle, mockMuscle2 } from '../muscle/mocks.ts';
import { mockUser } from '../user/mocks.ts';
import { getActivitiesChartData, getActivitiesStatistics, getExercisesStatistics } from './helpers.ts';
import { mockActivity, mockActivityPrev, mockWeeks, mockActivityRepository } from './mocks.ts';

describe('getActivitiesStatistics', () => {
  it('calculates activity statistics correctly', () => {
    const result = getActivitiesStatistics([mockActivity], [mockActivityPrev]);

    expect(result.activitiesCount.cur).toBe(1);
    expect(result.setsCount.cur).toBe(2);
    expect(result.repeatsCount.cur).toBe(25);
    expect(result.duration.cur).toBeGreaterThan(0);
  });

  it('handles empty arrays', () => {
    const result = getActivitiesStatistics([], []);

    expect(result.activitiesCount.cur).toBe(0);
    expect(result.activitiesCount.dynamics).toBe(0);
    expect(result.setsCount.cur).toBe(0);
    expect(result.setsCount.dynamics).toBe(0);
    expect(result.repeatsCount.cur).toBe(0);
    expect(result.repeatsCount.dynamics).toBe(0);
    expect(result.duration.cur).toBe(0);
    expect(result.duration.dynamics).toBe(0);
    expect(result.averageSetsPerActivity.cur).toBe(0);
    expect(result.averageSetsPerActivity.dynamics).toBe(0);
    expect(result.averageRepeatsPerSet.cur).toBe(0);
    expect(result.averageRepeatsPerSet.dynamics).toBe(0);
    expect(result.averageDuration.cur).toBe(0);
    expect(result.averageDuration.dynamics).toBe(0);
    expect(result.averageRestPercent.cur).toBe(0);
    expect(result.averageRestPercent.dynamics).toBe(0);
  });

  it('handles activities without exercises', () => {
    const activityWithoutExercises = { ...mockActivity, exercises: [] };
    const result = getActivitiesStatistics([activityWithoutExercises], []);

    expect(result.activitiesCount.cur).toBe(1);
    expect(result.setsCount.cur).toBe(0);
    expect(result.repeatsCount.cur).toBe(0);
  });

  it('calculates average statistics', () => {
    const activity1 = { ...mockActivity, _id: '1' };
    const activity2 = { ...mockActivity, _id: '2' };
    const result = getActivitiesStatistics([activity1, activity2], []);

    expect(result.averageSetsPerActivity.cur).toBe(2);
    expect(result.averageRepeatsPerSet.cur).toBe(13);
    expect(result.averageDuration.cur).toBeGreaterThanOrEqual(0);
    expect(result.averageRestPercent.cur).toBeGreaterThanOrEqual(0);
  });

  it('handles zero duration for average rest calculation', () => {
    const activityNoDuration = { ...mockActivity, dateCreated: new Date(), dateUpdated: new Date() };
    const result = getActivitiesStatistics([activityNoDuration], []);

    expect(result.averageRestPercent.cur).toBe(0);
  });

  it('handles activity with dateUpdated before dateCreated', () => {
    const activityBadDates = {
      ...mockActivity,
      dateCreated: new Date('2024-01-15T11:00:00Z'),
      dateUpdated: new Date('2024-01-15T10:00:00Z'),
    };
    const result = getActivitiesStatistics([activityBadDates], []);

    expect(result.duration.cur).toBe(0);
  });

  it('handles activity without dateUpdated', () => {
    const activityNoDateUpdated = { ...mockActivity, dateUpdated: undefined };
    const result = getActivitiesStatistics([activityNoDateUpdated], []);

    expect(result.duration.cur).toBeGreaterThanOrEqual(0);
  });

  it('handles exercise without repeats', () => {
    const activityNoRepeats = {
      ...mockActivity,
      exercises: [{ exercise: mockExercise, repeats: 0, duration: 60 }],
    };
    const result = getActivitiesStatistics([activityNoRepeats], []);

    expect(result.repeatsCount.cur).toBe(0);
  });

  it('calculates dynamics with positive change', () => {
    const currentActivity = { ...mockActivity, _id: 'current' };
    const prevActivity = {
      ...mockActivityPrev,
      _id: 'prev',
      exercises: [{ exercise: mockExercise, repeats: 5, duration: 30 }],
    };
    const result = getActivitiesStatistics([currentActivity], [prevActivity]);

    expect(result.activitiesCount.dynamics).toBe(0);

    expect(result.setsCount.dynamics).toBeGreaterThan(0);

    expect(result.repeatsCount.dynamics).toBeGreaterThan(0);
  });

  it('calculates dynamics with negative change', () => {
    const currentActivity = {
      ...mockActivity,
      exercises: [{ exercise: mockExercise, repeats: 5, duration: 30 }],
    };
    const prevActivity = { ...mockActivityPrev, _id: 'prev' };
    const result = getActivitiesStatistics([currentActivity], [prevActivity]);

    expect(result.setsCount.dynamics).toBeDefined();
  });

  it('calculates dynamics when previous has zero value', () => {
    const prevActivityZero = { ...mockActivityPrev, exercises: [] };
    const result = getActivitiesStatistics([mockActivity], [prevActivityZero]);

    expect(result.setsCount.dynamics).toBeDefined();
  });
});

describe('getExercisesStatistics', () => {
  it('calculates exercise statistics correctly', () => {
    const result = getExercisesStatistics([mockActivity], [mockActivityPrev], [mockExercise], mockUser);

    expect(result.length).toBeGreaterThan(0);
    const pushupsStats = result.find((s) => s.exercise._id === 'ex1');

    expect(pushupsStats).toBeDefined();
    expect(pushupsStats?.sets).toBe(1);
    expect(pushupsStats?.repeats).toBe(10);
  });

  it('handles empty activities', () => {
    const result = getExercisesStatistics([], [], [mockExercise], mockUser);

    expect(result.length).toBe(1);
    expect(result[0].sets).toBe(0);
    expect(result[0].repeats).toBe(0);
    expect(result[0].setsDynamics).toBe(0);
    expect(result[0].repeatsDynamics).toBe(0);
    expect(result[0].averageDuration).toBe(0);
  });

  it('checks user equipment matches', () => {
    const result = getExercisesStatistics([mockActivity], [], [mockExercise], mockUser);

    expect(result[0].isUserEquipmentMatches).toBe(true);
  });

  it('sorts by sets count descending', () => {
    const activityWithMoreSets = {
      ...mockActivity,
      exercises: [
        { exercise: mockExercise2, repeats: 20, duration: 120 },
        { exercise: mockExercise2, repeats: 20, duration: 120 },
      ],
    };

    const result = getExercisesStatistics([activityWithMoreSets], [], [mockExercise, mockExercise2], mockUser);

    expect(result[0].sets).toBeGreaterThanOrEqual(result[1].sets);
  });

  it('calculates dynamics with previous period', () => {
    const result = getExercisesStatistics([mockActivity], [mockActivityPrev], [mockExercise], mockUser);

    expect(result[0].setsDynamics).toBeDefined();
    expect(result[0].repeatsDynamics).toBeDefined();
  });

  it('calculates average duration correctly', () => {
    const result = getExercisesStatistics([mockActivity], [], [mockExercise], mockUser);

    expect(result[0].averageDuration).toBeGreaterThanOrEqual(0);
  });

  it('handles exercise without _id', () => {
    const exerciseNoId = { ...mockExercise, _id: undefined };
    const result = getExercisesStatistics([mockActivity], [], [exerciseNoId as typeof mockExercise], mockUser);

    expect(result.length).toBe(0);
  });

  it('handles activity without exercises in processActivities', () => {
    const activityNoExercises = { ...mockActivity, exercises: undefined };
    const result = getExercisesStatistics(
      [activityNoExercises as unknown as typeof mockActivity],
      [],
      [mockExercise],
      mockUser
    );

    expect(result[0].sets).toBe(0);
  });

  it('handles exercise record without exercise reference', () => {
    const activityBadExercise = {
      ...mockActivity,
      exercises: [{ exercise: undefined, repeats: 10, duration: 60 }],
    };
    const result = getExercisesStatistics([activityBadExercise as typeof mockActivity], [], [mockExercise], mockUser);

    expect(result[0].sets).toBe(0);
  });

  it('handles exercises with zero repeats and duration', () => {
    const activityZeros = {
      ...mockActivity,
      exercises: [{ exercise: mockExercise, repeats: 0, duration: 0 }],
    };
    const result = getExercisesStatistics([activityZeros], [], [mockExercise], mockUser);

    expect(result[0].sets).toBe(1);
    expect(result[0].repeats).toBe(0);
    expect(result[0].averageDuration).toBe(0);
  });
});

describe('getActivitiesChartData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('processes activity chart type', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.labels).toEqual(['Week 1', 'Week 2']);
    expect(result.datasets.length).toBe(2);
    expect(result.datasets[0].label).toBe('Занятия');
  });

  it('processes set chart type', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'set',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].label).toBe('Подходы');
  });

  it('processes repeat chart type', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'repeat',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].label).toBe('Повторы');
  });

  it('processes duration chart type', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'duration',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].label).toBe('Длительность');
  });

  it('processes muscle chart type', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'muscle',
      'ru',
      mockUser,
      [mockMuscle, mockMuscle2],
      false,
      false
    );

    expect(result.datasets.length).toBe(2);
  });

  it('handles empty activities', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].data[0]).toBe(0);
    expect(result.datasets[0].data[1]).toBe(0);
  });

  it('handles average mode', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'set',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      true
    );

    expect(result.datasets.length).toBe(2);
  });

  it('handles month mode', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      true,
      false
    );

    expect(result.datasets.length).toBe(2);
  });

  it('handles english locale', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'en',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].label).toBe('Activities');
  });

  it('updates existing datasets on subsequent calls', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].data.length).toBe(2);
    expect(result.datasets[1].data.length).toBe(2);
  });

  it('handles activities with exercise without muscles', async () => {
    const activityNoMuscles = {
      ...mockActivity,
      exercises: [{ exercise: { ...mockExercise, muscles: undefined }, repeats: 10, duration: 60 }],
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockResolvedValue([activityNoMuscles]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'muscle',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets.length).toBe(1);
    expect(result.datasets[0].data[0]).toBe(0);
  });

  it('handles activities with empty exercises in muscle chart', async () => {
    const activityEmptyExercises = { ...mockActivity, exercises: [] };

    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockResolvedValue([activityEmptyExercises]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'muscle',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets.length).toBe(1);
  });

  it('handles activity outside week range', async () => {
    const activityOutsideRange = {
      ...mockActivity,
      dateCreated: new Date('2024-02-01'),
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([activityOutsideRange]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].data[0]).toBe(0);
    expect(result.datasets[0].data[1]).toBe(0);
  });

  it('handles single week', async () => {
    const singleWeek = [mockWeeks[0]];

    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      singleWeek,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.labels.length).toBe(1);
    expect(result.datasets[0].data.length).toBe(1);
  });

  it('handles repeat chart with average mode', async () => {
    const activityInWeek1 = {
      ...mockActivity,
      dateCreated: new Date('2024-01-05'),
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([activityInWeek1]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'repeat',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      true
    );

    expect(result.datasets[0].data[0]).toBeGreaterThan(0);
  });

  it('handles duration chart with average mode', async () => {
    mockActivityRepository.getChartActivities.mockResolvedValue([mockActivity]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'duration',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      true
    );

    expect(result.datasets[0].data[0]).toBeGreaterThanOrEqual(0);
  });

  it('increments muscle count when exercise has matching muscles', async () => {
    const exerciseWithMuscle = {
      ...mockExercise,
      muscles: [mockMuscle],
    };

    const activityWithMuscle = {
      ...mockActivity,
      exercises: [
        { exercise: exerciseWithMuscle, repeats: 10, duration: 60 },
        { exercise: exerciseWithMuscle, repeats: 15, duration: 90 },
      ],
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockResolvedValue([activityWithMuscle]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'muscle',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets.length).toBe(1);
    expect(result.datasets[0].data[0]).toBe(2);
  });

  it('updates dataset labels to English on subsequent weeks', async () => {
    const exerciseWithMuscle = {
      ...mockExercise,
      muscles: [mockMuscle],
    };

    const activityInWeek1 = {
      ...mockActivity,
      dateCreated: new Date('2024-01-05'),
      exercises: [{ exercise: exerciseWithMuscle, repeats: 10, duration: 60 }],
    };

    const activityInWeek2 = {
      ...mockActivity,
      _id: '2',
      dateCreated: new Date('2024-01-10'),
      exercises: [{ exercise: exerciseWithMuscle, repeats: 15, duration: 90 }],
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockImplementation(
      async (filter: { dateCreated: { $gte: Date; $lt: Date } }) => {
        const dateFrom = filter.dateCreated.$gte;

        if (dateFrom.getTime() === new Date('2024-01-01').getTime()) {
          return [activityInWeek1];
        }

        return [activityInWeek2];
      }
    );

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'muscle',
      'en',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets.length).toBe(1);
    expect(result.datasets[0].label).toBe('Chest');
    expect(result.datasets[0].data.length).toBe(2);
  });

  it('calculates average muscle count when isAverage is true', async () => {
    const exerciseWithMuscle = {
      ...mockExercise,
      muscles: [mockMuscle],
    };

    const activityInWeek1 = {
      ...mockActivity,
      dateCreated: new Date('2024-01-05'),
      exercises: [{ exercise: exerciseWithMuscle, repeats: 10, duration: 60 }],
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([]);
    mockActivityRepository.getMuscleActivities.mockResolvedValue([activityInWeek1]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      [mockWeeks[0]],
      'muscle',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      true
    );

    expect(result.datasets.length).toBe(1);
    expect(result.datasets[0].data.length).toBe(1);
  });

  it('handles activity before first week in findWeekIndex', async () => {
    const activityBeforeFirstWeek = {
      ...mockActivity,
      dateCreated: new Date('2023-12-15'),
    };

    mockActivityRepository.getChartActivities.mockResolvedValue([activityBeforeFirstWeek]);

    const result = await getActivitiesChartData(
      mockActivityRepository,
      mockWeeks,
      'activity',
      'ru',
      mockUser,
      [mockMuscle],
      false,
      false
    );

    expect(result.datasets[0].data[0]).toBe(0);
    expect(result.datasets[0].data[1]).toBe(0);
  });
});
