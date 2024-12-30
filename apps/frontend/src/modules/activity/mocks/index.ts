import { ref, computed } from 'vue';
import { vi } from 'vitest';
import { TDeleteActivityDTO } from 'fitness-tracker-contracts';

import * as activityComposables from '@/activity/composables';
import { activityService } from '@/activity/services';
import { ACTIVITIES_CALENDAR_FIXTURE, ACTIVITIES_STATISTICS_FIXTURE, ACTIVITY_FIXTURE } from '@/activity/fixtures';
import { mockMutationReply, mockQueryReply } from '@/common/mocks';
import { IOnSuccess } from '@/common/interface';

const dateFrom = ref('2024-11-24T21:00:00.000Z');
const dateTo = ref('2025-01-05T20:59:59.000Z');
const isDatesReady = ref(true);
const spyUpdateDates = vi.fn();

const spyGetActivity = vi.spyOn(activityService, 'getOne').mockReturnValue(mockQueryReply(ACTIVITY_FIXTURE));

const spyDeleteActivity = vi.fn();

const onSuccess: IOnSuccess = {
  delete: undefined,
};

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

const computedActivityCalendarEvents = computed(() =>
  activityComposables.convertActivityCalendarEvents(ACTIVITIES_CALENDAR_FIXTURE)
);

const spyComputedActivityCalendarEvents = vi
  .spyOn(activityComposables, 'computedActivityCalendarEvents')
  .mockImplementation(() => computedActivityCalendarEvents);

const spyGetActivitiesCalendar = vi
  .spyOn(activityService, 'getCalendar')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_CALENDAR_FIXTURE));

const spyGetActivitiesStatistics = vi
  .spyOn(activityService, 'getStatistics')
  .mockImplementation(() => mockQueryReply(ACTIVITIES_STATISTICS_FIXTURE));

export {
  spyGetActivity,
  spyDeleteActivity,
  spyUseActivityCalendar,
  spyComputedActivityCalendarEvents,
  spyGetActivitiesCalendar,
  dateFrom,
  dateTo,
  isDatesReady,
  spyUpdateDates,
  computedActivityCalendarEvents,
  spyGetActivitiesStatistics,
  onSuccess,
};
