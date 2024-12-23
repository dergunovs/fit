import { vi } from 'vitest';
import {
  TDeleteUserDTO,
  TGetUsersDTO,
  TPostUserDataDTO,
  TPostUserDTO,
  TUpdateUserDataDTO,
  TUpdateUserDTO,
} from 'fitness-tracker-contracts';

import { userService } from '@/user/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { USER_FIXTURE, USERS_FIXTURE } from '@/user/fixtures';

const spyGetUser = vi.spyOn(userService, 'getOne').mockReturnValue(mockQueryReply(USER_FIXTURE));

const getUsersData: TGetUsersDTO = { data: USERS_FIXTURE, total: USERS_FIXTURE.length };

const spyGetUsers = vi.spyOn(userService, 'getMany').mockImplementation(() => mockQueryReply(getUsersData));

const spyCreateUser = vi.fn();
const spyUpdateUser = vi.fn();
const spyDeleteUser = vi.fn();

interface IOnSuccess {
  create?: () => Promise<void>;
  update?: () => Promise<void>;
  delete?: () => Promise<void>;
}

const onSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(userService, 'create').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.create = options.onSuccess;

  return mockMutationReply<TPostUserDTO, TPostUserDataDTO>(spyCreateUser);
});

vi.spyOn(userService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateUserDTO, TUpdateUserDataDTO>(spyUpdateUser);
});

vi.spyOn(userService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteUserDTO, string>(spyDeleteUser);
});

export { spyGetUser, spyGetUsers, getUsersData, spyCreateUser, spyUpdateUser, spyDeleteUser, onSuccess };
