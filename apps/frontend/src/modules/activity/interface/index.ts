export interface IActivityCalendarEvent<T> {
  _id?: string;
  start: Date | null;
  end: Date | null;
  title: string;
  content: T[];
  color?: string;
}

export interface ITimelineStep {
  left: number;
  right: number;
  type: 'rest' | 'exercise';
}
