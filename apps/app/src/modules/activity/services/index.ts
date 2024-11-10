import { ComputedRef, Ref } from 'vue';
import {
  API_ACTIVITY,
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_LAST,
  IActivity,
  IBaseReply,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export function getActivities(page: Ref<number>) {
  return useQuery({
    queryKey: [API_ACTIVITY, page],
    queryFn: async () => {
      const { data } = await api.get<{ data: IActivity[]; total: number }>(API_ACTIVITY, {
        params: { page: page.value },
      });

      return data;
    },
  });
}

export function getActivitiesCalendar(options: object, dateFrom?: Ref<string>, dateTo?: Ref<string>) {
  return useQuery({
    queryKey: [API_ACTIVITY_CALENDAR, dateFrom, dateTo],
    queryFn: async () => {
      const { data } = await api.get<IActivity[]>(API_ACTIVITY_CALENDAR, {
        params: { dateFrom: dateFrom?.value, dateTo: dateTo?.value },
      });

      return data;
    },
    ...options,
  });
}

export function getActivity(options: object, id?: ComputedRef<string | string[] | undefined>) {
  return useQuery({
    queryKey: [API_ACTIVITY, id],
    queryFn: async () => {
      if (!id?.value) return null;

      const { data } = await api.get<{ data: IActivity }>(`${API_ACTIVITY}/${id.value}`);

      return data.data;
    },
    ...options,
  });
}

export function getLastActivity() {
  return useQuery({
    queryKey: [API_ACTIVITY],
    queryFn: async () => {
      const { data } = await api.get<{ data: IActivity }>(API_ACTIVITY_LAST);

      return data.data;
    },
  });
}

export function postActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (formData: IActivity) => {
      const { data } = await api.post<IBaseReply>(API_ACTIVITY, formData);

      return data;
    },
    ...options,
  });
}

export function updateActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (formData: IActivity) => {
      const { data } = await api.patch<IBaseReply>(`${API_ACTIVITY}/${formData._id}`, formData);

      return data;
    },
    ...options,
  });
}

export function deleteActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (id?: string) => {
      if (!id) return null;

      const { data } = await api.delete<IBaseReply>(`${API_ACTIVITY}/${id}`);

      return data;
    },
    ...options,
  });
}
