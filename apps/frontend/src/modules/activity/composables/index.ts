import { ref, Ref, computed } from 'vue';
import { IActivity, IExerciseDone } from 'fitness-tracker-contracts';
import { IActivityCalendarEvent, ICalendarEvent } from '@/activity/interface';

export function useActivityCalendar() {
  const dateFrom = ref('');
  const dateTo = ref('');

  const isDatesReady = ref(false);

  function updateDates(dates: ICalendarEvent) {
    isDatesReady.value = true;

    dateFrom.value = dates.firstCellDate;
    dateTo.value = dates.lastCellDate;
  }

  return {
    dateFrom,
    dateTo,
    isDatesReady,
    updateDates,
  };
}

export function convertActivityCalendarEvents(activities?: IActivity[]) {
  return activities?.map((activity: IActivity) => {
    return {
      _id: activity._id,
      start: new Date(`${activity.dateCreated}`),
      end: new Date(`${activity.dateUpdated}`),
      title: '+',
      content: activity.exercises,
    };
  });
}

export function computedActivityCalendarEvents(calendar: Ref<IActivity[] | undefined>) {
  return computed<IActivityCalendarEvent<IExerciseDone>[] | undefined>(() =>
    convertActivityCalendarEvents(calendar.value)
  );
}
