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

const spyUseAuthCheck = vi.spyOn(authComposables, 'useAuthCheck').mockReturnValue();

const spyLogin = vi.fn();
const spySetup = vi.fn();

interface IOnSuccess {
  login?: (user: TPostAuthLoginDTO) => Promise<void>;
  setup?: () => Promise<void>;
}

const onSuccess: IOnSuccess = {
  login: undefined,
  setup: undefined,
};

vi.spyOn(authService, 'login').mockImplementation(
  (options: { onSuccess?: (user: TPostAuthLoginDTO) => Promise<void> }) => {
    if (options.onSuccess) onSuccess.login = options.onSuccess;

    return mockMutationReply<TPostAuthLoginDTO, TPostAuthLoginDataDTO>(spyLogin);
  }
);

vi.spyOn(authService, 'setup').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.setup = options.onSuccess;

  return mockMutationReply<TPostAuthSetupDTO, TPostAuthSetupDataDTO>(spySetup);
});

export { spyUseAuthCheck, spyLogin, spySetup, onSuccess };
