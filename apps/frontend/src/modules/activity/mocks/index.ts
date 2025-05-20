import { vi } from 'vitest';
import {
  TDeleteActivityDTO,
  TGetActivitiesDTO,
  TPostActivityDataDTO,
  TPostActivityDTO,
  TUpdateActivityDataDTO,
  TUpdateActivityDTO,
} from 'fitness-tracker-contracts';

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

const spyGetActivity = vi.spyOn(activityService, 'getOne').mockReturnValue(mockQueryReply(ACTIVITY_FIXTURE));

const spyGetActivityLast = vi.spyOn(activityService, 'getLast').mockReturnValue(mockQueryReply(ACTIVITY_FIXTURE_2));

const mockGetActivitiesData: TGetActivitiesDTO = { data: ACTIVITIES_FIXTURE, total: ACTIVITIES_FIXTURE.length };

const spyGetActivities = vi
  .spyOn(activityService, 'getMany')
  .mockImplementation(() => mockQueryReply(mockGetActivitiesData));

const spyCreateActivity = vi.fn();
const spyUpdateActivity = vi.fn();
const spyDeleteActivity = vi.fn();

const mockOnSuccess: IOnSuccess = {
  create: undefined,
  update: undefined,
  delete: undefined,
};

vi.spyOn(activityService, 'create').mockImplementation(
  (options: { onSuccess?: (id?: TPostActivityDTO) => Promise<void> }) => {
    if (options.onSuccess) mockOnSuccess.create = options.onSuccess;

    return mockMutationReply<TPostActivityDTO, TPostActivityDataDTO>(spyCreateActivity);
  }
);

vi.spyOn(activityService, 'update').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.update = options.onSuccess;

  return mockMutationReply<TUpdateActivityDTO, TUpdateActivityDataDTO>(spyUpdateActivity);
});

vi.spyOn(activityService, 'delete').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.delete = options.onSuccess;

  return mockMutationReply<TDeleteActivityDTO, string>(spyDeleteActivity);
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
  spyUpdateActivity,
  spyDeleteActivity,
  spyGetActivitiesCalendar,
  mockGetActivitiesData,
  mockOnSuccess,
};
