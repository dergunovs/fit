import { vi } from 'vitest';
import {
  TDeleteExerciseDTO,
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

const spyGetExercises = vi.spyOn(exerciseService, 'getAll').mockImplementation(() => mockQueryReply(EXERCISES_FIXTURE));

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

export { spyGetExercise, spyGetExercises, spyCreateExercise, spyUpdateExercise, spyDeleteExercise, mockOnSuccess };
