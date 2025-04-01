import { vi } from 'vitest';
import {
  TDeleteExerciseDTO,
  TGetExercisesDTO,
  TPostExerciseDataDTO,
  TPostExerciseDTO,
  TUpdateExerciseDataDTO,
  TUpdateExerciseDTO,
} from 'fitness-tracker-contracts';

import { exerciseService } from '@/exercise/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { EXERCISE_FIXTURE, EXERCISE_FIXTURE_CUSTOM, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { IOnSuccess } from '@/common/interface';

const spyGetExercise = vi.spyOn(exerciseService, 'getOne').mockReturnValue(mockQueryReply(EXERCISE_FIXTURE));

const mockGetExercisesData: TGetExercisesDTO = { data: EXERCISES_FIXTURE, total: EXERCISES_FIXTURE.length };

const spyGetExercises = vi
  .spyOn(exerciseService, 'getMany')
  .mockImplementation(() => mockQueryReply(mockGetExercisesData));

const spyGetExercisesAll = vi
  .spyOn(exerciseService, 'getAll')
  .mockImplementation(() => mockQueryReply(EXERCISES_FIXTURE));

const spyGetExercisesCustom = vi
  .spyOn(exerciseService, 'getCustom')
  .mockImplementation(() => mockQueryReply([EXERCISE_FIXTURE_CUSTOM]));

const spyCreateExercise = vi.fn();
const spyUpdateExercise = vi.fn();
const spyDeleteExercise = vi.fn();

const mockOnSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(exerciseService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.create = options.onSuccess;

  return mockMutationReply<TPostExerciseDTO, TPostExerciseDataDTO>(spyCreateExercise);
});

vi.spyOn(exerciseService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateExerciseDTO, TUpdateExerciseDataDTO>(spyUpdateExercise);
});

vi.spyOn(exerciseService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteExerciseDTO, string>(spyDeleteExercise);
});

export {
  spyGetExercise,
  spyGetExercises,
  spyGetExercisesCustom,
  spyGetExercisesAll,
  spyCreateExercise,
  spyUpdateExercise,
  spyDeleteExercise,
  mockOnSuccess,
  mockGetExercisesData,
};
