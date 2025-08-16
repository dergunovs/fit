import { ComputedRef, Ref } from 'vue';
import {
  API_EXERCISE,
  API_EXERCISE_ALL,
  API_EXERCISE_CUSTOM,
  TGetExercisesDTO,
  TGetExercisesCustomDTO,
  TGetExercisesQueryDTO,
  TGetExerciseDTO,
  TPostExerciseDTO,
  TPostExerciseDataDTO,
  TUpdateExerciseDTO,
  TUpdateExerciseDataDTO,
  TDeleteExerciseDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export const exerciseService = {
  getMany: (page: Ref<number>) =>
    useQuery({
      queryKey: [API_EXERCISE, page],
      queryFn: async () => {
        const params: TGetExercisesQueryDTO = { page: page.value };

        const { data } = await api.get<TGetExercisesDTO>(API_EXERCISE, { params });

        return data;
      },
    }),

  getAll: () =>
    useQuery({
      queryKey: [API_EXERCISE, API_EXERCISE_ALL],
      queryFn: async () => {
        const { data } = await api.get<TGetExercisesDTO>(API_EXERCISE_ALL);

        return data.data;
      },
    }),

  getCustom: (options: object) =>
    useQuery({
      queryKey: [API_EXERCISE, API_EXERCISE_CUSTOM],
      queryFn: async () => {
        const { data } = await api.get<TGetExercisesCustomDTO>(API_EXERCISE_CUSTOM);

        return data.data;
      },
      ...options,
    }),

  getOne: (options: object, id: ComputedRef<string>) =>
    useQuery({
      queryKey: [API_EXERCISE, id],
      queryFn: async () => {
        const { data } = await api.get<TGetExerciseDTO>(`${API_EXERCISE}/${id.value}`);

        return data.data;
      },
      ...options,
    }),

  create: (options: object) =>
    useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (formData: TPostExerciseDataDTO) => {
        const { data } = await api.post<TPostExerciseDTO>(API_EXERCISE, formData);

        return data;
      },
      ...options,
    }),

  update: (options: object) =>
    useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (formData: TUpdateExerciseDataDTO) => {
        const { data } = await api.patch<TUpdateExerciseDTO>(`${API_EXERCISE}/${formData._id}`, formData);

        return data;
      },
      ...options,
    }),

  delete: (options: object) =>
    useMutation({
      mutationKey: [API_EXERCISE],
      mutationFn: async (id: string) => {
        const { data } = await api.delete<TDeleteExerciseDTO>(`${API_EXERCISE}/${id}`);

        return data;
      },
      ...options,
    }),
};
