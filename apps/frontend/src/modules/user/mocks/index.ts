import { vi } from 'vitest';
import {
  TDeleteUserDTO,
  TGetUsersDTO,
  TPostUserDataDTO,
  TPostUserDTO,
  TPostUserFeedbackDataDTO,
  TPostUserFeedbackDTO,
  TUpdateUserDataDTO,
  TUpdateUserDTO,
  TUpdateUserPasswordDataDTO,
  TUpdateUserPasswordDTO,
} from 'fitness-tracker-contracts';

import { userService } from '@/user/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { USER_FIXTURE, USERS_FIXTURE } from '@/user/fixtures';
import { IOnSuccess } from '@/common/interface';

const spyGetUser = vi.spyOn(userService, 'getOne').mockReturnValue(mockQueryReply(USER_FIXTURE));

const mockGetUsersData: TGetUsersDTO = { data: USERS_FIXTURE, total: USERS_FIXTURE.length };

const spyGetUsers = vi.spyOn(userService, 'getMany').mockImplementation(() => mockQueryReply(mockGetUsersData));

const spyCreateUser = vi.fn();
const spyUpdateUser = vi.fn();
const spyUpdateUserPassword = vi.fn();
const spyDeleteUser = vi.fn();
const spyUserFeedback = vi.fn();

const mockOnSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  updatePassword: undefined,
  delete: undefined,
  feedback: undefined,
};

vi.spyOn(userService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.create = options.onSuccess;

  return mockMutationReply<TPostUserDTO, TPostUserDataDTO>(spyCreateUser);
});

vi.spyOn(userService, 'feedback').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.feedback = options.onSuccess;

  return mockMutationReply<TPostUserFeedbackDTO, TPostUserFeedbackDataDTO>(spyUserFeedback);
});

vi.spyOn(userService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateUserDTO, TUpdateUserDataDTO>(spyUpdateUser);
});

vi.spyOn(userService, 'updatePassword').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.updatePassword = options.onSuccess;

  return mockMutationReply<TUpdateUserPasswordDTO, TUpdateUserPasswordDataDTO>(spyUpdateUserPassword);
});

vi.spyOn(userService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteUserDTO, string>(spyDeleteUser);
});

export {
  spyGetUser,
  spyGetUsers,
  spyCreateUser,
  spyUpdateUser,
  spyUpdateUserPassword,
  spyDeleteUser,
  spyUserFeedback,
  mockOnSuccess,
  mockGetUsersData,
};
