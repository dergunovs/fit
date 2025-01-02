import { ref } from 'vue';
import { vi } from 'vitest';
import {
  TDeleteActivityDTO,
  TGetActivitiesDTO,
  TPostActivityDataDTO,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import * as activityComposables from '@/activity/composables';
import { activityService } from '@/activity/services';
import {
  ACTIVITIES_CALENDAR_FIXTURE,
  ACTIVITIES_FIXTURE,
  ACTIVITIES_STATISTICS_FIXTURE,
  ACTIVITY_FIXTURE,
  ACTIVITY_FIXTURE_2,
  ACTIVITIES_CHART_FIXTURE,
} from '@/activity/fixtures';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { IOnSuccess } from '@/common/interface';

const dateFrom = ref('2024-11-24T21:00:00.000Z');
const dateTo = ref('2025-01-05T20:59:59.000Z');
const isDatesReady = ref(true);
const spyUpdateDates = vi.fn();

const spyGetActivity = vi.spyOn(activityService, 'getOne').mockReturnValue(mockQueryReply(ACTIVITY_FIXTURE));

const spyGetActivityLast = vi.spyOn(activityService, 'getLast').mockReturnValue(mockQueryReply(ACTIVITY_FIXTURE_2));

const getActivitiesData: TGetActivitiesDTO = { data: ACTIVITIES_FIXTURE, total: ACTIVITIES_FIXTURE.length };

const spyGetActivities = vi
  .spyOn(activityService, 'getMany')
  .mockImplementation(() => mockQueryReply(getActivitiesData));

const spyCreateActivity = vi.fn();
const spyDeleteActivity = vi.fn();

const onSuccess: IOnSuccess = {
  create: undefined,
  delete: undefined,
};

vi.spyOn(activityService, 'create').mockImplementation(
  (options: { onSuccess?: (id?: TPostActivityDTO) => Promise<void> }) => {
    if (options.onSuccess) onSuccess.create = options.onSuccess;

    return mockMutationReply<TPostActivityDTO, TPostActivityDataDTO>(spyCreateActivity);
  }
);

vi.spyOn(activityService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) onSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteActivityDTO, string>(spyDeleteActivity);
});

const spyUseActivityCalendar = vi.spyOn(activityComposables, 'useActivityCalendar').mockReturnValue({
  dateFrom,
  dateTo,
  isDatesReady,
  updateDates: spyUpdateDates,
});

const spyGetActivitiesCalendar = vi
  .spyOn(activityService, 'getCalendar')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_CALENDAR_FIXTURE));

const spyGetActivitiesStatistics = vi
  .spyOn(activityService, 'getStatistics')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_STATISTICS_FIXTURE));

const spyGetActivitiesChart = vi
  .spyOn(activityService, 'getChart')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_CHART_FIXTURE));

export {
  spyGetActivities,
  spyGetActivity,
  spyGetActivityLast,
  spyGetActivitiesStatistics,
  spyGetActivitiesChart,
  spyCreateActivity,
  spyDeleteActivity,
  spyUseActivityCalendar,
  spyGetActivitiesCalendar,
  spyUpdateDates,
  dateFrom,
  dateTo,
  isDatesReady,
  getActivitiesData,
  onSuccess,
};
