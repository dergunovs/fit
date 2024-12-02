import {
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_SETUP,
  ILoginData,
  TGetAuthDTO,
  TPostAuthLoginDTO,
  TPostAuthSetupDTO,
} from 'fitness-tracker-contracts';
import { useQuery, useMutation, api, setAuth } from 'mhz-helpers';

export function getAuth() {
  return useQuery({
    queryKey: [API_AUTH_GET],
    queryFn: async () => {
      const { data } = await api.get<TGetAuthDTO>(API_AUTH_GET);

      if (data.message) setAuth(true);

      return data;
    },
  });
}

export function login(options: object) {
  return useMutation({
    mutationKey: [API_AUTH_LOGIN],
    mutationFn: async (formData: ILoginData) => {
      const { data } = await api.post<TPostAuthLoginDTO>(API_AUTH_LOGIN, formData);

      return data;
    },
    ...options,
  });
}

export function setup(options: object) {
  return useMutation({
    mutationKey: [API_AUTH_SETUP],
    mutationFn: async (formData: ILoginData) => {
      const { data } = await api.post<TPostAuthSetupDTO>(API_AUTH_SETUP, formData);

      return data;
    },
    ...options,
  });
}
