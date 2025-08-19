import { vi } from 'vitest';
import {
  TDeleteMuscleDTO,
  TPostMuscleDataDTO,
  TPostMuscleDTO,
  TUpdateMuscleDataDTO,
  TUpdateMuscleDTO,
} from 'fitness-tracker-contracts';

import { muscleService } from '@/muscle/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { MUSCLE_FIXTURE, MUSCLES_FIXTURE } from '@/muscle/fixtures';
import { IOnSuccess } from '@/common/interface';

const spyGetMuscle = vi.spyOn(muscleService, 'getOne').mockReturnValue(mockQueryReply(MUSCLE_FIXTURE));
const spyGetMuscles = vi.spyOn(muscleService, 'getAll').mockImplementation(() => mockQueryReply(MUSCLES_FIXTURE));

const spyCreateMuscle = vi.fn();
const spyUpdateMuscle = vi.fn();
const spyDeleteMuscle = vi.fn();

const mockOnSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(muscleService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.create = options.onSuccess;

  return mockMutationReply<TPostMuscleDTO, TPostMuscleDataDTO>(spyCreateMuscle);
});

vi.spyOn(muscleService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateMuscleDTO, TUpdateMuscleDataDTO>(spyUpdateMuscle);
});

vi.spyOn(muscleService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteMuscleDTO, string>(spyDeleteMuscle);
});

export { spyGetMuscle, spyGetMuscles, spyCreateMuscle, spyUpdateMuscle, spyDeleteMuscle, mockOnSuccess };
