import {
  IBaseReply,
  IBaseService,
  IEntity,
  IPaginatedQuery,
  IPaginatedReply,
  IToken,
} from "./base";
import { IExerciseDone, IExerciseStatistics } from "./exercise";

export interface IActivity extends IEntity {
  exercises: IExerciseDone[];
  isDone: boolean;
}

export interface IActivityStatistics {
  activitiesCount: number;
  setsCount: number;
  repeatsCount: number;
  duration: number;
  averageSetsPerActivity: number;
  averageRepeatsPerSet: number;
  averageDuration: number;
  averageRestPercent: number;
}

export interface IActivityChart {
  labels: string[];
  data: number[];
}

export type TActivityChartType = "activity" | "set" | "repeat";

export interface IActivityService extends IBaseService {
  getCalendar: (dateFrom: string, dateTo: string) => Promise<IActivity[]>;

  getStatistics: () => Promise<{
    activity: IActivityStatistics;
    exercise: IExerciseStatistics[];
  }>;

  getChart: (type: TActivityChartType) => Promise<IActivityChart>;

  getLast: <T>(
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<{ data: T | null }>;
}

export type TGetActivitiesDTO = IPaginatedReply<IActivity>;
export type TGetActivitiesQueryDTO = IPaginatedQuery;
export type TGetActivitiesCalendarDTO = IActivity[];
export type TGetActivitiesCalendarQueryDTO = {
  dateFrom: string;
  dateTo: string;
};
export type TGetActivitiesStatisticsDTO = {
  activity: IActivityStatistics;
  exercise: IExerciseStatistics[];
};
export type TGetActivitiesChartDTO = IActivityChart;
export type TGetActivitiesChartQueryDTO = { type: TActivityChartType };
export type TGetActivityDTO = { data: IActivity | null };
export type TGetActivityLastDTO = { data: IActivity | null };
export type TPostActivityDTO = string;
export type TUpdateActivityDTO = IBaseReply;
export type TDeleteActivityDTO = IBaseReply;

export declare const API_ACTIVITY = "/activity";
export declare const API_ACTIVITY_CALENDAR = "/activity_calendar";
export declare const API_ACTIVITY_STATISTICS = "/activity_statistics";
export declare const API_ACTIVITY_CHART = "/activity_chart";
export declare const API_ACTIVITY_LAST = "/activity_last";
