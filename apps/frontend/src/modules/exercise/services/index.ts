import { ComputedRef } from 'vue';
import {
  API_EXERCISE,
  TGetExercisesDTO,
  TGetExerciseDTO,
  TPostExerciseDTO,
  TPostExerciseDataDTO,
  TUpdateExerciseDTO,
  TUpdateExerciseDataDTO,
  TDeleteExerciseDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export const exerciseService = {
  getAll: () => {
    return useQuery({
      queryKey: [API_EXERCISE],
      queryFn: async () => {
        const { data } = await api.get<TGetExercisesDTO>(API_EXERCISE);

        return data.data;
      },
    });
  },

  getOne: (id?: ComputedRef<string>) => {
    return useQuery({
      queryKey: [API_EXERCISE, id],
      queryFn: async () => {
        if (!id?.value) return null;

        const { data } = await api.get<TGetExerciseDTO>(`${API_EXERCISE}/${id.value}`);

        return data.data;
      },
    });
  },

  create: (options: object) => {
    return useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (formData: TPostExerciseDataDTO) => {
        const { data } = await api.post<TPostExerciseDTO>(API_EXERCISE, formData);

        return data;
      },
      ...options,
    });
  },

  update: (options: object) => {
    return useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (formData: TUpdateExerciseDataDTO) => {
        const { data } = await api.patch<TUpdateExerciseDTO>(`${API_EXERCISE}/${formData._id}`, formData);

        return data;
      },
      ...options,
    });
  },

  delete: (options: object) => {
    return useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (id: string) => {
        const { data } = await api.delete<TDeleteExerciseDTO>(`${API_EXERCISE}/${id}`);

        return data;
      },
      ...options,
    });
  },
};
