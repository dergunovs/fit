import { describe, expect, test } from 'vitest';

import { generateMuscleStatistics } from '.';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

describe('muscle helpers', () => {
  test('generates muscle group statistics for ru locale', async () => {
    const muscleGroupStatistics = [
      { repeats: 12, sets: 1, title: 'Грудь', color: '#00CED1' },
      { repeats: 12, sets: 1, title: 'Ноги', color: '#0000ff' },
      { repeats: 12, sets: 1, title: 'Плечи', color: '#C41E3A' },
      { repeats: 12, sets: 1, title: 'Пресс', color: '#32CD32' },
    ];

    expect(generateMuscleStatistics(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, 'ru')).toStrictEqual(
      muscleGroupStatistics
    );
  });

  test('generates muscle group statistics for en locale', async () => {
    const muscleGroupStatistics = [
      { repeats: 12, sets: 1, title: 'Chest', color: '#00CED1' },
      { repeats: 12, sets: 1, title: 'Legs', color: '#0000ff' },
      { repeats: 12, sets: 1, title: 'Shoulders', color: '#C41E3A' },
      { repeats: 12, sets: 1, title: 'Abs', color: '#32CD32' },
    ];

    expect(generateMuscleStatistics(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, 'en')).toStrictEqual(
      muscleGroupStatistics
    );
  });

  test('handles empty arrays', async () => {
    expect(generateMuscleStatistics([], MUSCLES_FIXTURE, 'ru')).toEqual([]);
    expect(generateMuscleStatistics(EXERCISES_DONE_FIXTURE, [], 'ru')).toEqual([]);
  });

  test('handles exercises without muscle groups', async () => {
    const exercisesWithoutMuscles = [
      {
        _id: '3',
        exercise: {
          _id: '4',
          title: 'Бег',
          description: 'Описание 4',
          createdBy: { _id: '1', name: 'User 1', email: 'a@b.ru' },
          muscles: [],
          isWeights: false,
          isWeightsRequired: false,
        },
        repeats: 30,
        weight: 0,
        duration: 600,
        isToFailure: false,
        isDone: true,
        dateUpdated: new Date('2024-11-30T07:34:57.304Z'),
      },
    ];

    expect(generateMuscleStatistics(exercisesWithoutMuscles, MUSCLES_FIXTURE, 'ru')).toEqual([]);
  });

  test('handles exercises with non-matching muscle groups', async () => {
    const exercisesWithNonMatchingMuscles = [
      {
        _id: '3',
        exercise: {
          _id: '4',
          title: 'Бег',
          description: 'Описание 4',
          createdBy: { _id: '1', name: 'User 1', email: 'a@b.ru' },
          muscles: [{ _id: 'nonexistent-muscle-id', title: 'Неизвестная мышца', color: '#000000' }],
          isWeights: false,
          isWeightsRequired: false,
        },
        repeats: 30,
        weight: 0,
        duration: 600,
        isToFailure: false,
        isDone: true,
        dateUpdated: new Date('2024-11-30T07:34:57.304Z'),
      },
    ];

    expect(generateMuscleStatistics(exercisesWithNonMatchingMuscles, MUSCLES_FIXTURE, 'ru')).toEqual([]);
  });
});
