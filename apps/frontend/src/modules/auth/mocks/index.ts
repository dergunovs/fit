import { ref } from 'vue';
import { vi } from 'vitest';
import {
  TLocale,
  TPostAuthConfirmTokenDataDTO,
  TPostAuthConfirmTokenDTO,
  TPostAuthLoginDataDTO,
  TPostAuthLoginDTO,
  TPostAuthRegisterDataDTO,
  TPostAuthRegisterDTO,
  TPostAuthResetPasswordDataDTO,
  TPostAuthResetPasswordDTO,
  TPostAuthSetupDataDTO,
  TPostAuthSetupDTO,
} from 'fitness-tracker-contracts';

import { authService } from '@/auth/services';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import * as authComposables from '@/auth/composables';
import { IOnSuccess } from '@/common/interface';
import { USER_FIXTURE } from '@/user/fixtures';

const mockIsAdmin = ref(true);
const mockIsAuthChecked = ref(true);

const spyUseAuthCheck = vi
  .spyOn(authComposables, 'useAuthCheck')
  .mockReturnValue({ user: ref(USER_FIXTURE), isAdmin: ref(mockIsAdmin), isAuthChecked: ref(mockIsAuthChecked) });

const spyLogin = vi.fn();
const spySetup = vi.fn();
const spyRegister = vi.fn();
const spyConfirmToken = vi.fn();
const spyResetPassword = vi.fn();

const mockOnSuccess: IOnSuccess = {
  check: undefined,
  login: undefined,
  setup: undefined,
  register: undefined,
  confirmToken: undefined,
  resetPassword: undefined,
};

const spyCheckAuth = vi.spyOn(authService, 'check').mockImplementation(() => mockQueryReply(USER_FIXTURE));

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

vi.spyOn(authService, 'register').mockImplementation((_lang: TLocale, options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.register = options.onSuccess;

  return mockMutationReply<TPostAuthRegisterDTO, TPostAuthRegisterDataDTO>(spyRegister);
});

vi.spyOn(authService, 'confirmToken').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.confirmToken = options.onSuccess;

  return mockMutationReply<TPostAuthConfirmTokenDTO, TPostAuthConfirmTokenDataDTO>(spyConfirmToken);
});

vi.spyOn(authService, 'resetPassword').mockImplementation(
  (_lang: TLocale, options: { onSuccess?: () => Promise<void> }) => {
    if (options.onSuccess) mockOnSuccess.resetPassword = options.onSuccess;

    return mockMutationReply<TPostAuthResetPasswordDTO, TPostAuthResetPasswordDataDTO>(spyResetPassword);
  }
);

export {
  spyUseAuthCheck,
  spyCheckAuth,
  spyLogin,
  spySetup,
  spyRegister,
  spyConfirmToken,
  spyResetPassword,
  mockOnSuccess,
  mockIsAdmin,
};
