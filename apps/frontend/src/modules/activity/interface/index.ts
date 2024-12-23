export interface IActivityCalendarEvent<T> {
  _id?: string;
  start: Date;
  end: Date;
  title: string;
  content: T[];
}

export interface ICalendarEvent {
  firstCellDate: string;
  lastCellDate: string;
}
