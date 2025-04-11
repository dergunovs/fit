import { describe, expect, test } from 'vitest';

import { generateMuscleStatistics } from '.';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

describe('exercise helpers', () => {
  test('generates muscle group statistics', async () => {
    const muscleGroupStatistics = [
      { repeats: 12, sets: 1, title: 'Грудь', color: '#00CED1' },
      { repeats: 12, sets: 1, title: 'Ноги', color: '#000080' },
      { repeats: 12, sets: 1, title: 'Плечи', color: '#C41E3A' },
      { repeats: 12, sets: 1, title: 'Пресс', color: '#32CD32' },
    ];

    expect(generateMuscleStatistics(EXERCISES_DONE_FIXTURE, MUSCLES_FIXTURE, 'ru')).toStrictEqual(
      muscleGroupStatistics
    );
  });
});
