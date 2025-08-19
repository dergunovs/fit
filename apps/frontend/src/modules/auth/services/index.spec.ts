import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  API_AUTH_CONFIRM,
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUTH_RESET,
  API_AUTH_SETUP,
  TGetAuthDTO,
  TPostAuthConfirmTokenDTO,
  TPostAuthLoginDTO,
  TPostAuthRegisterDTO,
  TPostAuthResetPasswordDTO,
  TPostAuthSetupDTO,
} from 'fitness-tracker-contracts';
import { serviceMocks } from '@/common/mocks';
import { USER_FIXTURE } from '@/user/fixtures';
import { PASSWORD_FIXTURE, TOKEN_FIXTURE } from '@/auth/fixtures';
import { BASE_REPLY, LANG_FIXTURE } from '@/common/fixtures';

const formData = { email: USER_FIXTURE.email, passowrd: PASSWORD_FIXTURE };
const registerData = { name: USER_FIXTURE.name, ...formData };

describe('authService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('check', async () => {
    serviceMocks.http.mockGet<TGetAuthDTO>(USER_FIXTURE);

    const { authService } = await import('@/auth/services');

    authService.check({});

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(USER_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_AUTH_GET]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_AUTH_GET);
  });

  it('login', async () => {
    serviceMocks.http.mockPost<TPostAuthLoginDTO>({ user: USER_FIXTURE, token: TOKEN_FIXTURE });

    const { authService } = await import('@/auth/services');

    authService.login({});

    expect(await serviceMocks.lastMutation.mutationFn(formData)).toEqual({ user: USER_FIXTURE, token: TOKEN_FIXTURE });
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_AUTH_LOGIN]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_AUTH_LOGIN, formData);
  });

  it('setup', async () => {
    serviceMocks.http.mockPost<TPostAuthSetupDTO>(BASE_REPLY);

    const { authService } = await import('@/auth/services');

    authService.setup({});

    expect(await serviceMocks.lastMutation.mutationFn(formData)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_AUTH_SETUP]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_AUTH_SETUP, formData);
  });

  it('register', async () => {
    serviceMocks.http.mockPost<TPostAuthRegisterDTO>(BASE_REPLY);

    const { authService } = await import('@/auth/services');

    authService.register(LANG_FIXTURE, {});

    expect(await serviceMocks.lastMutation.mutationFn(registerData)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_AUTH_REGISTER]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_AUTH_REGISTER, registerData, {
      params: { lang: LANG_FIXTURE },
    });
  });

  it('confirmToken', async () => {
    serviceMocks.http.mockPost<TPostAuthConfirmTokenDTO>(BASE_REPLY);

    const { authService } = await import('@/auth/services');

    authService.confirmToken({});

    expect(await serviceMocks.lastMutation.mutationFn({ token: TOKEN_FIXTURE })).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_AUTH_CONFIRM]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_AUTH_CONFIRM, { token: TOKEN_FIXTURE });
  });

  it('resetPassword', async () => {
    serviceMocks.http.mockPost<TPostAuthResetPasswordDTO>(BASE_REPLY);

    const { authService } = await import('@/auth/services');

    authService.resetPassword(LANG_FIXTURE, {});

    expect(await serviceMocks.lastMutation.mutationFn({ email: USER_FIXTURE.email })).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_AUTH_RESET]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(
      API_AUTH_RESET,
      { email: USER_FIXTURE.email },
      { params: { lang: LANG_FIXTURE } }
    );
  });
});
