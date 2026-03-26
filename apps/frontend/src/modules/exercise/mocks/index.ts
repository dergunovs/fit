import { vi } from 'vitest';

import { exerciseService } from '@/exercise/services';
import { createModuleMocks, mockQueryReply } from '@/common/mocks';
import { EXERCISE_FIXTURE, EXERCISE_FIXTURE_CUSTOM, EXERCISES_FIXTURE } from '@/exercise/fixtures';

const base = createModuleMocks({
  service: exerciseService,
  fixtures: { one: EXERCISE_FIXTURE, many: EXERCISES_FIXTURE },
});

const spyGetExercisesAll = vi
  .spyOn(exerciseService, 'getAll')
  .mockImplementation(() => mockQueryReply(EXERCISES_FIXTURE));

const spyGetExercisesCustom = vi
  .spyOn(exerciseService, 'getCustom')
  .mockImplementation(() => mockQueryReply([EXERCISE_FIXTURE_CUSTOM]));

export const {
  spyGetOne: spyGetExercise,
  spyGetMany: spyGetExercises,
  spyCreate: spyCreateExercise,
  spyUpdate: spyUpdateExercise,
  spyDelete: spyDeleteExercise,
  mockOnSuccess,
  mockGetManyData: mockGetExercisesData,
} = base;

export { spyGetExercisesAll, spyGetExercisesCustom };
