import {
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUTH_SETUP,
  API_AUTH_CONFIRM,
  API_AUTH_RESET,
  TGetAuthDTO,
  TPostAuthConfirmTokenDTO,
  TPostAuthConfirmTokenDataDTO,
  TPostAuthLoginDTO,
  TPostAuthLoginDataDTO,
  TPostAuthRegisterDTO,
  TPostAuthRegisterDataDTO,
  TPostAuthSetupDTO,
  TPostAuthSetupDataDTO,
  TPostAuthResetPasswordDataDTO,
  TPostAuthResetPasswordDTO,
  TPostAuthRegisterQueryDTO,
  TPostAuthResetPasswordQueryDTO,
} from 'fitness-tracker-contracts';
import { useQuery, useMutation, api } from 'mhz-helpers';

export const authService = {
  check: (options: object) => {
    return useQuery({
      queryKey: [API_AUTH_GET],
      queryFn: async () => {
        const { data } = await api.get<TGetAuthDTO>(API_AUTH_GET);

        return data;
      },
      ...options,
    });
  },

  login: (options: object) => {
    return useMutation({
      mutationKey: [API_AUTH_LOGIN],
      mutationFn: async (formData: TPostAuthLoginDataDTO) => {
        const { data } = await api.post<TPostAuthLoginDTO>(API_AUTH_LOGIN, formData);

        return data;
      },
      ...options,
    });
  },

  setup: (options: object) => {
    return useMutation({
      mutationKey: [API_AUTH_SETUP],
      mutationFn: async (formData: TPostAuthSetupDataDTO) => {
        const { data } = await api.post<TPostAuthSetupDTO>(API_AUTH_SETUP, formData);

        return data;
      },
      ...options,
    });
  },

  register: (lang: string, options: object) => {
    return useMutation({
      mutationKey: [API_AUTH_REGISTER],
      mutationFn: async (formData: TPostAuthRegisterDataDTO) => {
        const params: TPostAuthRegisterQueryDTO = { lang };

        const { data } = await api.post<TPostAuthRegisterDTO>(API_AUTH_REGISTER, formData, { params });

        return data;
      },
      ...options,
    });
  },

  confirmToken: (options: object) => {
    return useMutation({
      mutationKey: [API_AUTH_CONFIRM],
      mutationFn: async (token: TPostAuthConfirmTokenDataDTO) => {
        const { data } = await api.post<TPostAuthConfirmTokenDTO>(API_AUTH_CONFIRM, token);

        return data;
      },
      ...options,
    });
  },

  resetPassword: (lang: string, options: object) => {
    return useMutation({
      mutationKey: [API_AUTH_RESET],
      mutationFn: async (email: TPostAuthResetPasswordDataDTO) => {
        const params: TPostAuthResetPasswordQueryDTO = { lang };

        const { data } = await api.post<TPostAuthResetPasswordDTO>(API_AUTH_RESET, email, { params });

        return data;
      },
      ...options,
    });
  },
};
