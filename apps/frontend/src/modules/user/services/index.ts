import { ComputedRef, Ref } from 'vue';
import {
  API_USER,
  TGetUsersDTO,
  TGetUsersQueryDTO,
  TGetUserDTO,
  TPostUserDTO,
  TPostUserDataDTO,
  TUpdateUserDTO,
  TUpdateUserDataDTO,
  TDeleteUserDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export const userService = {
  getMany: (page: Ref<number>) => {
    return useQuery({
      queryKey: [API_USER, page],
      queryFn: async () => {
        const params: TGetUsersQueryDTO = { page: page.value };

        const { data } = await api.get<TGetUsersDTO>(API_USER, { params });

        return data;
      },
    });
  },

  getOne: (options: object, id?: ComputedRef<string | undefined>) => {
    return useQuery({
      queryKey: [API_USER, id],
      queryFn: async () => {
        if (!id?.value) return null;

        const { data } = await api.get<TGetUserDTO>(`${API_USER}/${id.value}`);

        return data.data;
      },
      ...options,
    });
  },

  create: (options: object) => {
    return useMutation({
      mutationKey: [API_USER],
      mutationFn: async (formData: TPostUserDataDTO) => {
        const { data } = await api.post<TPostUserDTO>(API_USER, formData);

        return data;
      },
      ...options,
    });
  },

  update: (options: object) => {
    return useMutation({
      mutationKey: [API_USER],
      mutationFn: async (formData: TUpdateUserDataDTO) => {
        const { data } = await api.patch<TUpdateUserDTO>(`${API_USER}/${formData._id}`, formData);

        return data;
      },
      ...options,
    });
  },

  delete: (options: object) => {
    return useMutation({
      mutationKey: [API_USER],
      mutationFn: async (id: string) => {
        const { data } = await api.delete<TDeleteUserDTO>(`${API_USER}/${id}`);

        return data;
      },
      ...options,
    });
  },
};
