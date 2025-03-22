import { ComputedRef } from 'vue';
import {
  API_MUSCLE,
  TGetMusclesDTO,
  TGetMuscleDTO,
  TPostMuscleDTO,
  TPostMuscleDataDTO,
  TUpdateMuscleDTO,
  TUpdateMuscleDataDTO,
  TDeleteMuscleDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export const muscleService = {
  getAll: () => {
    return useQuery({
      queryKey: [API_MUSCLE],
      queryFn: async () => {
        const { data } = await api.get<TGetMusclesDTO>(API_MUSCLE);

        return data.data;
      },
    });
  },

  getOne: (options: object, id?: ComputedRef<string | undefined>) => {
    return useQuery({
      queryKey: [API_MUSCLE, id],
      queryFn: async () => {
        if (!id?.value) return null;

        const { data } = await api.get<TGetMuscleDTO>(`${API_MUSCLE}/${id.value}`);

        return data.data;
      },
      ...options,
    });
  },

  create: (options: object) => {
    return useMutation({
      mutationKey: [API_MUSCLE],
      mutationFn: async (formData: TPostMuscleDataDTO) => {
        const { data } = await api.post<TPostMuscleDTO>(API_MUSCLE, formData);

        return data;
      },
      ...options,
    });
  },

  update: (options: object) => {
    return useMutation({
      mutationKey: [API_MUSCLE],
      mutationFn: async (formData: TUpdateMuscleDataDTO) => {
        const { data } = await api.patch<TUpdateMuscleDTO>(`${API_MUSCLE}/${formData._id}`, formData);

        return data;
      },
      ...options,
    });
  },

  delete: (options: object) => {
    return useMutation({
      mutationKey: [API_MUSCLE],
      mutationFn: async (id: string) => {
        const { data } = await api.delete<TDeleteMuscleDTO>(`${API_MUSCLE}/${id}`);

        return data;
      },
      ...options,
    });
  },
};
