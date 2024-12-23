import { ref, computed } from 'vue';
import { vi } from 'vitest';

import * as activityComposables from '@/activity/composables';
import { activityService } from '@/activity/services';
import { ACTIVITIES_CALENDAR_FIXTURE, ACTIVITIES_STATISTICS_FIXTURE } from '@/activity/fixtures';
import { mockQueryReply } from '@/common/mocks';

const dateFrom = ref('2024-11-24T21:00:00.000Z');
const dateTo = ref('2025-01-05T20:59:59.000Z');
const isDatesReady = ref(true);
const spyUpdateDates = vi.fn();

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
  spyUseActivityCalendar,
  spyComputedActivityCalendarEvents,
  spyGetActivitiesCalendar,
  dateFrom,
  dateTo,
  isDatesReady,
  spyUpdateDates,
  computedActivityCalendarEvents,
  spyGetActivitiesStatistics,
};
