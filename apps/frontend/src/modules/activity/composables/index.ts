import { ref } from 'vue';

import { ICalendarEvent } from '@/activity/interface';

export function useActivityCalendar() {
  const dateFrom = ref('');
  const dateTo = ref('');

  const isDatesReady = ref(false);

  function updateDates(dates: ICalendarEvent) {
    isDatesReady.value = true;

    dateFrom.value = dates.firstCellDate;
    dateTo.value = dates.lastCellDate;
  }

  return { dateFrom, dateTo, isDatesReady, updateDates };
}
