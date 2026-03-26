import { vi } from 'vitest';

import { userService } from '@/user/services';
import { createModuleMocks, mockMutationReply } from '@/common/mocks';
import { USER_FIXTURE, USERS_FIXTURE } from '@/user/fixtures';

const base = createModuleMocks({
  service: userService,
  fixtures: { one: USER_FIXTURE, many: USERS_FIXTURE },
});

const spyUpdateUserPassword = vi.fn();
const spyUserFeedback = vi.fn();

vi.spyOn(userService, 'feedback').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) base.mockOnSuccess.feedback = options.onSuccess;

  return mockMutationReply(spyUserFeedback);
});

vi.spyOn(userService, 'updatePassword').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) base.mockOnSuccess.updatePassword = options.onSuccess;

  return mockMutationReply(spyUpdateUserPassword);
});

export const {
  spyGetOne: spyGetUser,
  spyGetMany: spyGetUsers,
  spyCreate: spyCreateUser,
  spyUpdate: spyUpdateUser,
  spyDelete: spyDeleteUser,
  mockOnSuccess,
  mockGetManyData: mockGetUsersData,
} = base;

export { spyUpdateUserPassword, spyUserFeedback };
