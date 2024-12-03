import { ComputedRef, Ref } from 'vue';
import {
  API_ACTIVITY,
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_LAST,
  API_ACTIVITY_STATISTICS,
  API_ACTIVITY_CHART,
  TActivityChartType,
  TGetActivitiesDTO,
  TGetActivitiesQueryDTO,
  TGetActivitiesCalendarDTO,
  TGetActivitiesCalendarQueryDTO,
  TGetActivitiesStatisticsDTO,
  TGetActivitiesStatisticsQueryDTO,
  TGetActivitiesChartDTO,
  TGetActivitiesChartQueryDTO,
  TGetActivityDTO,
  TGetActivityLastDTO,
  TPostActivityDTO,
  TPostActivityDataDTO,
  TUpdateActivityDTO,
  TUpdateActivityDataDTO,
  TDeleteActivityDTO,
} from 'fitness-tracker-contracts';
import { useMutation, useQuery, api } from 'mhz-helpers';

export function getActivities(page: Ref<number>) {
  return useQuery({
    queryKey: [API_ACTIVITY, page],
    queryFn: async () => {
      const params: TGetActivitiesQueryDTO = { page: page.value };

      const { data } = await api.get<TGetActivitiesDTO>(API_ACTIVITY, { params });

      return data;
    },
  });
}

export function getActivitiesCalendar(options: object, dateFrom: Ref<string>, dateTo: Ref<string>) {
  return useQuery({
    queryKey: [API_ACTIVITY_CALENDAR, dateFrom, dateTo],
    queryFn: async () => {
      const params: TGetActivitiesCalendarQueryDTO = { dateFrom: dateFrom.value, dateTo: dateTo.value };

      const { data } = await api.get<TGetActivitiesCalendarDTO>(API_ACTIVITY_CALENDAR, { params });

      return data;
    },
    ...options,
  });
}

export function getActivitiesStatistics(gap: number) {
  return useQuery({
    queryKey: [API_ACTIVITY_STATISTICS],
    queryFn: async () => {
      const params: TGetActivitiesStatisticsQueryDTO = { gap };

      const { data } = await api.get<TGetActivitiesStatisticsDTO>(API_ACTIVITY_STATISTICS, { params });

      return data;
    },
  });
}

export function getActivitiesChart(type: Ref<TActivityChartType>) {
  return useQuery({
    queryKey: [API_ACTIVITY_CHART, type],
    queryFn: async () => {
      const params: TGetActivitiesChartQueryDTO = { type: type.value };

      const { data } = await api.get<TGetActivitiesChartDTO>(API_ACTIVITY_CHART, { params });

      return data;
    },
  });
}

export function getActivity(options: object, id?: ComputedRef<string>) {
  return useQuery({
    queryKey: [API_ACTIVITY, id],
    queryFn: async () => {
      if (!id?.value) return null;

      const { data } = await api.get<TGetActivityDTO>(`${API_ACTIVITY}/${id.value}`);

      return data.data;
    },
    ...options,
  });
}

export function getActivityLast() {
  return useQuery({
    queryKey: [API_ACTIVITY],
    queryFn: async () => {
      const { data } = await api.get<TGetActivityLastDTO>(API_ACTIVITY_LAST);

      return data.data;
    },
  });
}

export function postActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (formData: TPostActivityDataDTO) => {
      const { data } = await api.post<TPostActivityDTO>(API_ACTIVITY, formData);

      return data;
    },
    ...options,
  });
}

export function updateActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (formData: TUpdateActivityDataDTO) => {
      const { data } = await api.patch<TUpdateActivityDTO>(`${API_ACTIVITY}/${formData._id}`, formData);

      return data;
    },
    ...options,
  });
}

export function deleteActivity(options: object) {
  return useMutation({
    mutationKey: [API_ACTIVITY],
    mutationFn: async (id: string) => {
      const { data } = await api.delete<TDeleteActivityDTO>(`${API_ACTIVITY}/${id}`);

      return data;
    },
    ...options,
  });
}
