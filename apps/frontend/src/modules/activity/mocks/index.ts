import { vi } from 'vitest';

import { activityService } from '@/activity/services';
import {
  ACTIVITIES_CALENDAR_FIXTURE,
  ACTIVITIES_FIXTURE,
  ACTIVITIES_STATISTICS_FIXTURE,
  ACTIVITY_FIXTURE,
  ACTIVITY_CHART_FIXTURE,
} from '@/activity/fixtures';
import { createModuleMocks, mockQueryReply } from '@/common/mocks';

const base = createModuleMocks({
  service: activityService,
  fixtures: { one: ACTIVITY_FIXTURE, many: ACTIVITIES_FIXTURE },
});

const spyGetActivitiesCalendar = vi
  .spyOn(activityService, 'getCalendar')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_CALENDAR_FIXTURE));

const spyGetActivitiesStatistics = vi
  .spyOn(activityService, 'getStatistics')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_STATISTICS_FIXTURE));

const spyGetActivitiesChart = vi
  .spyOn(activityService, 'getChart')
  .mockImplementation(() => mockQueryReply(ACTIVITY_CHART_FIXTURE));

export const {
  spyGetOne: spyGetActivity,
  spyGetMany: spyGetActivities,
  spyCreate: spyCreateActivity,
  spyUpdate: spyUpdateActivity,
  spyDelete: spyDeleteActivity,
  mockOnSuccess,
  mockGetManyData: mockGetActivitiesData,
} = base;

export { spyGetActivitiesCalendar, spyGetActivitiesStatistics, spyGetActivitiesChart };
