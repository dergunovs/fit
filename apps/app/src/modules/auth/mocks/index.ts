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

const spyMutateLogin = vi.fn();
const spyMutateSetup = vi.fn();

interface IOnSuccess {
  login?: (user: TPostAuthLoginDTO) => void;
  setup?: () => void;
}

const onSuccess: IOnSuccess = {
  login: undefined,
  setup: undefined,
};

vi.spyOn(authService, 'login').mockImplementation((options: { onSuccess?: (user: TPostAuthLoginDTO) => void }) => {
  if (options.onSuccess) onSuccess.login = options.onSuccess;

  return mockMutationReply<TPostAuthLoginDTO, TPostAuthLoginDataDTO>(spyMutateLogin);
});

vi.spyOn(authService, 'setup').mockImplementation((options: { onSuccess?: () => void }) => {
  if (options.onSuccess) onSuccess.setup = options.onSuccess;

  return mockMutationReply<TPostAuthSetupDTO, TPostAuthSetupDataDTO>(spyMutateSetup);
});

export { spyUseAuthCheck, spyMutateLogin, spyMutateSetup, onSuccess };
