import { describe, it, expect } from 'vitest';

import { mockExercise } from '../exercise/mocks.js';
import { mockUser } from '../user/mocks.js';
import { getActivitiesStatistics, getExercisesStatistics } from './helpers.js';
import { mockActivity, mockActivityPrev } from './mocks.js';

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
    expect(result.setsCount.cur).toBe(0);
    expect(result.repeatsCount.cur).toBe(0);
  });

  it('calculates dynamics correctly', () => {
    const result = getActivitiesStatistics([mockActivity], [mockActivityPrev]);

    // Current has 1 activity, previous has 1 activity -> 0% change
    expect(result.activitiesCount.dynamics).toBe(0);
  });

  it('handles activities without exercises', () => {
    const activityWithoutExercises = { ...mockActivity, exercises: [] };
    const result = getActivitiesStatistics([activityWithoutExercises], []);

    expect(result.activitiesCount.cur).toBe(1);
    expect(result.setsCount.cur).toBe(0);
    expect(result.repeatsCount.cur).toBe(0);
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
  });

  it('checks user equipment matches', () => {
    const result = getExercisesStatistics([mockActivity], [], [mockExercise], mockUser);

    expect(result[0].isUserEquipmentMatches).toBe(true);
  });

  it('sorts by sets count descending', () => {
    const exercise2 = { ...mockExercise, _id: 'ex2', title: 'Squats' };
    const activityWithMoreSets = {
      ...mockActivity,
      exercises: [
        {
          exercise: { _id: 'ex2', title: 'Squats', isWeights: false, isWeightsRequired: false },
          repeats: 20,
          duration: 120,
        },
        {
          exercise: { _id: 'ex2', title: 'Squats', isWeights: false, isWeightsRequired: false },
          repeats: 20,
          duration: 120,
        },
      ],
    };

    const result = getExercisesStatistics([activityWithMoreSets], [], [mockExercise, exercise2], mockUser);

    expect(result[0].sets).toBeGreaterThanOrEqual(result[1].sets);
  });
});
