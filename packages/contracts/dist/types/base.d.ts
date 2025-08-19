export { GOALS } from "..";

export interface IGoals {
  activities: number;
  sets: number;
  repeats: number;
  duration: number;
}

export type TLocale = "ru" | "en";

export interface IEntity {
  _id?: string;
  dateCreated?: Date | string;
  dateUpdated?: Date | string;
}

export interface IBaseParams {
  id: string;
}

export interface IBaseReply {
  message: string;
}

export interface IPaginatedQuery {
  page: number;
}

export interface IPaginatedReply<T> {
  data: T[];
  total: number;
}
