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
import { EXERCISE_FIXTURE, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { IOnSuccess } from '@/common/interface';

const spyGetExercise = vi.spyOn(exerciseService, 'getOne').mockReturnValue(mockQueryReply(EXERCISE_FIXTURE));

const getExercisesData: TGetExercisesDTO = EXERCISES_FIXTURE;

const spyGetExercises = vi.spyOn(exerciseService, 'getAll').mockImplementation(() => mockQueryReply(getExercisesData));

const spyCreateExercise = vi.fn();
const spyUpdateExercise = vi.fn();
const spyDeleteExercise = vi.fn();

const onSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(exerciseService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.create = options.onSuccess;

  return mockMutationReply<TPostExerciseDTO, TPostExerciseDataDTO>(spyCreateExercise);
});

vi.spyOn(exerciseService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateExerciseDTO, TUpdateExerciseDataDTO>(spyUpdateExercise);
});

vi.spyOn(exerciseService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteExerciseDTO, string>(spyDeleteExercise);
});

export {
  spyGetExercise,
  spyGetExercises,
  getExercisesData,
  spyCreateExercise,
  spyUpdateExercise,
  spyDeleteExercise,
  onSuccess,
};
