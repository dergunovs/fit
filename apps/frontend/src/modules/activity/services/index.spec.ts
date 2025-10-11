import { computed, ref } from 'vue';
import { describe, it, expect } from 'vitest';
import {
  API_ACTIVITY,
  TDeleteActivityDTO,
  TGetActivityDTO,
  TGetActivitiesDTO,
  TPostActivityDTO,
  TUpdateActivityDTO,
  API_ACTIVITY_CALENDAR,
  TGetActivitiesStatisticsDTO,
  API_ACTIVITY_STATISTICS,
  TGetActivitiesCalendarDTO,
  TGetActivitiesChartDTO,
  TActivityChartType,
  API_ACTIVITY_CHART,
} from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';
import { activityService } from '@/activity/services';
import {
  ACTIVITIES_FIXTURE,
  ACTIVITIES_STATISTICS_FIXTURE,
  ACTIVITY_CHART_FIXTURE,
  ACTIVITY_FIXTURE,
} from '@/activity/fixtures';
import { BASE_REPLY, paginatedReply, LANG_FIXTURE } from '@/common/fixtures';

const page = computed(() => 1);
const id = computed(() => '123');

const gap = 1;
const dateFrom = ref(new Date('01-01-2020'));
const dateTo = ref(new Date('01-02-2020'));
const type = ref<TActivityChartType>('set');
const isMonth = ref(true);
const isAverage = ref(true);
const locale = ref(LANG_FIXTURE);

describe('activityService', () => {
  it('getMany', async () => {
    serviceMocks.http.mockGet<TGetActivitiesDTO>(paginatedReply(ACTIVITIES_FIXTURE));
    activityService.getMany(page);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(paginatedReply(ACTIVITIES_FIXTURE));
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY, page]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_ACTIVITY, { params: { page: page.value } });
  });

  it('getStatistics', async () => {
    serviceMocks.http.mockGet<TGetActivitiesStatisticsDTO>(ACTIVITIES_STATISTICS_FIXTURE);
    activityService.getStatistics(gap);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(ACTIVITIES_STATISTICS_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY_STATISTICS]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_ACTIVITY_STATISTICS, { params: { gap } });
  });

  it('getCalendar', async () => {
    serviceMocks.http.mockGet<TGetActivitiesCalendarDTO>(ACTIVITIES_FIXTURE);
    activityService.getCalendar({}, dateFrom, dateTo);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(ACTIVITIES_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY_CALENDAR, dateFrom, dateTo]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_ACTIVITY_CALENDAR, {
      params: { dateFrom: dateFrom.value.toISOString(), dateTo: dateTo.value.toISOString() },
    });
  });

  it('getChart', async () => {
    serviceMocks.http.mockGet<TGetActivitiesChartDTO>(ACTIVITY_CHART_FIXTURE);
    activityService.getChart(type, isMonth, isAverage, locale);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(ACTIVITY_CHART_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY_CHART, type, isMonth, isAverage, locale]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(API_ACTIVITY_CHART, {
      params: {
        type: type.value,
        month: isMonth.value.toString(),
        average: isAverage.value.toString(),
        locale: locale.value,
      },
    });
  });

  it('getOne', async () => {
    serviceMocks.http.mockGet<TGetActivityDTO>({ data: ACTIVITY_FIXTURE });
    activityService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(ACTIVITY_FIXTURE);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY, id]);
    expect(serviceMocks.http.get).toHaveBeenCalledWith(`${API_ACTIVITY}/${id.value}`);
  });

  it('getOne with empty id', async () => {
    const emptyId = computed(() => '');

    serviceMocks.http.mockGet<TGetActivityDTO>({ data: null } as unknown as TGetActivityDTO);
    activityService.getOne({}, emptyId);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(null);
    expect(serviceMocks.lastQuery.queryKey).toEqual([API_ACTIVITY, emptyId]);
  });

  it('getOne with null data', async () => {
    serviceMocks.http.mockGet<TGetActivityDTO>({ data: null } as unknown as TGetActivityDTO);
    activityService.getOne({}, id);

    expect(await serviceMocks.lastQuery.queryFn()).toEqual(null);
  });

  it('create', async () => {
    serviceMocks.http.mockPost<TPostActivityDTO>(`${ACTIVITY_FIXTURE._id}`);
    activityService.create({});

    expect(await serviceMocks.lastMutation.mutationFn(ACTIVITY_FIXTURE)).toEqual(ACTIVITY_FIXTURE._id);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_ACTIVITY]);
    expect(serviceMocks.http.post).toHaveBeenCalledWith(API_ACTIVITY, ACTIVITY_FIXTURE);
  });

  it('update', async () => {
    serviceMocks.http.mockPatch<TUpdateActivityDTO>(BASE_REPLY);
    activityService.update({});

    expect(await serviceMocks.lastMutation.mutationFn(ACTIVITY_FIXTURE)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_ACTIVITY]);
    expect(serviceMocks.http.patch).toHaveBeenCalledWith(`${API_ACTIVITY}/${ACTIVITY_FIXTURE._id}`, ACTIVITY_FIXTURE);
  });

  it('delete', async () => {
    serviceMocks.http.mockDelete<TDeleteActivityDTO>(BASE_REPLY);
    activityService.delete({});

    expect(await serviceMocks.lastMutation.mutationFn(id.value)).toEqual(BASE_REPLY);
    expect(serviceMocks.lastMutation.mutationKey).toEqual([API_ACTIVITY, API_ACTIVITY_CALENDAR]);
    expect(serviceMocks.http.delete).toHaveBeenCalledWith(`${API_ACTIVITY}/${id.value}`);
  });
});
