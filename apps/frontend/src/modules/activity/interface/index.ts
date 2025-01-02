export interface IActivityCalendarEvent<T> {
  _id?: string;
  start: Date | null;
  end: Date | null;
  title: string;
  content: T[];
}

export interface ICalendarEvent {
  firstCellDate: string;
  lastCellDate: string;
}
