import { ref } from 'vue';

import { ICalendarDates } from '@/activity/interface';

export function useActivityCalendar() {
  const dateFrom = ref('');
  const dateTo = ref('');

  const isDatesReady = ref(false);

  function updateDates(dates: ICalendarDates) {
    isDatesReady.value = true;

    dateFrom.value = dates.dateFrom;
    dateTo.value = dates.dateTo;
  }

  return { dateFrom, dateTo, isDatesReady, updateDates };
}
