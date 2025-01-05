import { vi } from 'vitest';
import {
  TPostAuthLoginDataDTO,
  TPostAuthLoginDTO,
  TPostAuthSetupDataDTO,
  TPostAuthSetupDTO,
} from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';
import { mockMutationReply } from '@/common/mocks';
import * as authComposables from '@/auth/composables';
import { IOnSuccess } from '@/common/interface';

const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockReturnValue();

const spyLogin = vi.fn();
const spySetup = vi.fn();

const mockOnSuccess: IOnSuccess = {
  login: undefined,
  setup: undefined,
};

vi.spyOn(authService, 'login').mockImplementation(
  (options: { onSuccess?: (user: TPostAuthLoginDTO) => Promise<void> }) => {
    if (options.onSuccess) mockOnSuccess.login = options.onSuccess;

    return mockMutationReply<TPostAuthLoginDTO, TPostAuthLoginDataDTO>(spyLogin);
  }
);

vi.spyOn(authService, 'setup').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.setup = options.onSuccess;

  return mockMutationReply<TPostAuthSetupDTO, TPostAuthSetupDataDTO>(spySetup);
});

export { spyUseAuthCheck, spyLogin, spySetup, mockOnSuccess };
