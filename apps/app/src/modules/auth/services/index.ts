import {
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_SETUP,
  TGetAuthDTO,
  TPostAuthLoginDTO,
  TPostAuthLoginDataDTO,
  TPostAuthSetupDTO,
  TPostAuthSetupDataDTO,
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
};
