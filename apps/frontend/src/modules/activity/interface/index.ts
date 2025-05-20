export interface IActivityCalendarEvent<T> {
  _id?: string;
  start: Date | null;
  startSeconds: number;
  end: Date | null;
  endSeconds: number;
  title: string;
  content: T[];
  color?: string;
}

export interface ITimelineStep {
  left: number;
  right: number;
  type: 'rest' | 'exercise';
}
