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
