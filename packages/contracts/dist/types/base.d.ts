import { TDecode } from "./auth";

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

export interface IBaseService {
  getMany: <T>(
    page: number,
    decode?: TDecode,
    token?: string,
  ) => Promise<IPaginatedReply<T>>;

  getOne: <T>(
    id: string,
    decode?: TDecode,
    token?: string,
  ) => Promise<{ data: T | null }>;

  update: <T>(
    _id: string,
    itemToUpdate: T,
    decode?: TDecode,
    token?: string,
  ) => Promise<boolean | void>;

  create: <T>(
    item: T,
    decode?: TDecode,
    token?: string,
  ) => Promise<string | boolean | void>;

  delete: (
    _id: string,
    decode?: TDecode,
    token?: string,
  ) => Promise<boolean | void>;
}
