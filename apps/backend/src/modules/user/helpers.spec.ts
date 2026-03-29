import { describe, it, expect } from 'vitest';

import {
  mockExercise,
  mockExerciseNoEquipment,
  mockExerciseOnlyEquipmentForWeight,
  mockExerciseWithBothEquipments,
  mockExerciseWeightsRequired,
  mockExerciseNoEquipmentId,
  mockExerciseEmptyEquipmentForWeight,
} from '../exercise/mocks.ts';
import {
  mockUser,
  mockAdmin,
  mockUserNoEquipments,
  mockUserEmptyEquipments,
  mockUserWithEquipmentForWeight,
  mockUserWithCustomGoals,
} from './mocks.ts';
import { isUserEquipmentMatches, getUserGoals } from './helpers.ts';

describe('isUserEquipmentMatches', () => {
  it('returns true when exercise has no equipment and no equipmentForWeight', () => {
    const result = isUserEquipmentMatches(mockExerciseNoEquipment, mockUser);

    expect(result).toBe(true);
  });

  it('returns false when user has no equipments and exercise requires equipment', () => {
    const result = isUserEquipmentMatches(mockExercise, mockUserEmptyEquipments);

    expect(result).toBe(false);
  });

  it('returns false when user equipments is undefined and exercise requires equipment', () => {
    const result = isUserEquipmentMatches(mockExercise, mockUserNoEquipments);

    expect(result).toBe(false);
  });

  it('returns true when user has matching equipment and weights are not required', () => {
    const result = isUserEquipmentMatches(mockExercise, mockUser);

    expect(result).toBe(true);
  });

  it('returns true when exercise has only equipmentForWeight and user has it', () => {
    const result = isUserEquipmentMatches(mockExerciseOnlyEquipmentForWeight, mockUserWithEquipmentForWeight);

    expect(result).toBe(true);
  });

  it('returns true when exercise has only equipmentForWeight, user does not have it, but weights are not required', () => {
    const result = isUserEquipmentMatches(mockExerciseOnlyEquipmentForWeight, mockUser);

    expect(result).toBe(true);
  });

  it('returns true when exercise has both equipments and user has both', () => {
    const result = isUserEquipmentMatches(mockExerciseWithBothEquipments, mockUserWithEquipmentForWeight);

    expect(result).toBe(true);
  });

  it('returns true when exercise has both equipments, user has only equipment, and weights are not required', () => {
    const result = isUserEquipmentMatches(mockExerciseWithBothEquipments, mockUser);

    expect(result).toBe(true);
  });

  it('returns false when isWeightsRequired is true and user has no equipmentForWeight', () => {
    const result = isUserEquipmentMatches(mockExerciseWeightsRequired, mockUser);

    expect(result).toBe(false);
  });

  it('returns true when isWeightsRequired is true and user has equipmentForWeight', () => {
    const result = isUserEquipmentMatches(mockExerciseWeightsRequired, mockUserWithEquipmentForWeight);

    expect(result).toBe(true);
  });

  it('returns false when exercise equipment._id is undefined', () => {
    const result = isUserEquipmentMatches(mockExerciseNoEquipmentId, mockUser);

    expect(result).toBe(false);
  });

  it('returns true when exercise equipmentForWeight is empty array (no equipment, no weights required)', () => {
    const result = isUserEquipmentMatches(mockExerciseEmptyEquipmentForWeight, mockUser);

    expect(result).toBe(true);
  });

  it('returns false when admin user has no equipments and exercise requires equipment', () => {
    const result = isUserEquipmentMatches(mockExercise, mockAdmin);

    expect(result).toBe(false);
  });
});

describe('getUserGoals', () => {
  it('returns weekly goals without averaging', () => {
    const result = getUserGoals(false, false, mockUserWithCustomGoals);

    expect(result.activitiesGoal).toBe(5);
    expect(result.setsGoal).toBe(30 * 5);
    expect(result.repeatsGoal).toBe(15 * 30 * 5);
    expect(result.durationGoal).toBe(60 * 5);
  });

  it('returns monthly goals without averaging', () => {
    const result = getUserGoals(true, false, mockUserWithCustomGoals);

    expect(result.activitiesGoal).toBe(Math.floor(5 * 4.5));
    expect(result.setsGoal).toBe(30 * Math.floor(5 * 4.5));
    expect(result.repeatsGoal).toBe(15 * 30 * Math.floor(5 * 4.5));
    expect(result.durationGoal).toBe(60 * Math.floor(5 * 4.5));
  });

  it('returns weekly goals with averaging', () => {
    const result = getUserGoals(false, true, mockUserWithCustomGoals);

    expect(result.activitiesGoal).toBe(5);
    expect(result.setsGoal).toBe(30);
    expect(result.repeatsGoal).toBe(15 * 30);
    expect(result.durationGoal).toBe(60);
  });

  it('returns monthly goals with averaging', () => {
    const result = getUserGoals(true, true, mockUserWithCustomGoals);

    expect(result.activitiesGoal).toBe(Math.floor(5 * 4.5));
    expect(result.setsGoal).toBe(30);
    expect(result.repeatsGoal).toBe(15 * 30);
    expect(result.durationGoal).toBe(60);
  });

  it('returns default goals when user has no goal values', () => {
    const result = getUserGoals(false, false, mockUser);

    expect(result.activitiesGoal).toBe(2);
    expect(result.setsGoal).toBe(24 * 2);
    expect(result.repeatsGoal).toBe(12 * 24 * 2);
    expect(result.durationGoal).toBe(40 * 2);
  });

  it('returns default monthly goals when user has no goal values', () => {
    const result = getUserGoals(true, false, mockUser);

    expect(result.activitiesGoal).toBe(Math.floor(2 * 4.5));
    expect(result.setsGoal).toBe(24 * Math.floor(2 * 4.5));
    expect(result.repeatsGoal).toBe(12 * 24 * Math.floor(2 * 4.5));
    expect(result.durationGoal).toBe(40 * Math.floor(2 * 4.5));
  });

  it('returns default averaged goals when user has no goal values', () => {
    const result = getUserGoals(false, true, mockUser);

    expect(result.activitiesGoal).toBe(2);
    expect(result.setsGoal).toBe(24);
    expect(result.repeatsGoal).toBe(12 * 24);
    expect(result.durationGoal).toBe(40);
  });

  it('returns goals for admin user with defaults', () => {
    const result = getUserGoals(false, false, mockAdmin);

    expect(result.activitiesGoal).toBe(2);
    expect(result.setsGoal).toBe(48);
    expect(result.repeatsGoal).toBe(576);
    expect(result.durationGoal).toBe(80);
  });
});
