import {
  IBaseReply,
  IBaseService,
  IEntity,
  IPaginatedQuery,
  IPaginatedReply,
  IToken,
} from "./base";
import { IExerciseDone, IExerciseStatistics } from "./exercise";
import { IUser } from "./user";

export {
  API_ACTIVITY,
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_STATISTICS,
  API_ACTIVITY_CHART,
  API_ACTIVITY_LAST,
} from "../index";

export interface IActivity extends IEntity {
  exercises: IExerciseDone[];
  isDone: boolean;
  createdBy?: IUser;
}

export interface IActivityStatisticsValues {
  cur: number;
  dynamics: number;
}

export interface IActivityStatistics {
  activitiesCount: IActivityStatisticsValues;
  setsCount: IActivityStatisticsValues;
  repeatsCount: IActivityStatisticsValues;
  duration: IActivityStatisticsValues;
  averageSetsPerActivity: IActivityStatisticsValues;
  averageRepeatsPerSet: IActivityStatisticsValues;
  averageDuration: IActivityStatisticsValues;
  averageRestPercent: IActivityStatisticsValues;
}

export interface IActivityChartDataset {
  data: number[];
  label?: string;
}

export interface IActivityChart {
  labels: string[];
  datasets: IActivityChartDataset[];
}

export type TActivityChartType = "activity" | "set" | "repeat" | "group";

export interface IActivityService extends IBaseService {
  getCalendar: (dateFrom: string, dateTo: string) => Promise<IActivity[]>;

  getStatistics: (gap: number) => Promise<{
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
export type TGetActivitiesStatisticsQueryDTO = { gap: number };
export type TGetActivitiesChartDTO = IActivityChart;
export type TGetActivitiesChartQueryDTO = { type: TActivityChartType };
export type TGetActivityDTO = { data: IActivity | null };
export type TGetActivityLastDTO = { data: IActivity | null };

export type TPostActivityDTO = string;
export type TPostActivityDataDTO = IActivity;

export type TUpdateActivityDTO = IBaseReply;
export type TUpdateActivityDataDTO = IActivity;

export type TDeleteActivityDTO = IBaseReply;
