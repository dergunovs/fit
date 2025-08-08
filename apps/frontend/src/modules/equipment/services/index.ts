import { ComputedRef } from 'vue';
import {
  API_EQUIPMENT,
  TGetEquipmentsDTO,
  TGetEquipmentDTO,
  TPostEquipmentDTO,
  TPostEquipmentDataDTO,
  TUpdateEquipmentDTO,
  TUpdateEquipmentDataDTO,
  TDeleteEquipmentDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export const equipmentService = {
  getAll: () =>
    useQuery({
      queryKey: [API_EQUIPMENT],
      queryFn: async () => {
        const { data } = await api.get<TGetEquipmentsDTO>(API_EQUIPMENT);

        return data.data;
      },
    }),

  getOne: (options: object, id: ComputedRef<string>) =>
    useQuery({
      queryKey: [API_EQUIPMENT, id],
      queryFn: async () => {
        const { data } = await api.get<TGetEquipmentDTO>(`${API_EQUIPMENT}/${id.value}`);

        return data.data;
      },
      ...options,
    }),

  create: (options: object) =>
    useMutation({
      mutationKey: [API_EQUIPMENT],
      mutationFn: async (formData: TPostEquipmentDataDTO) => {
        const { data } = await api.post<TPostEquipmentDTO>(API_EQUIPMENT, formData);

        return data;
      },
      ...options,
    }),

  update: (options: object) =>
    useMutation({
      mutationKey: [API_EQUIPMENT],
      mutationFn: async (formData: TUpdateEquipmentDataDTO) => {
        const { data } = await api.patch<TUpdateEquipmentDTO>(`${API_EQUIPMENT}/${formData._id}`, formData);

        return data;
      },
      ...options,
    }),

  delete: (options: object) =>
    useMutation({
      mutationKey: [API_EQUIPMENT],
      mutationFn: async (id: string) => {
        const { data } = await api.delete<TDeleteEquipmentDTO>(`${API_EQUIPMENT}/${id}`);

        return data;
      },
      ...options,
    }),
};
