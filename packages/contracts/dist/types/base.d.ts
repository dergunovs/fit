import { TUserRole } from "./user";

export interface IEntity {
  _id?: string;
  dateCreated?: Date | string;
  dateUpdated?: Date | string;
}

export interface IToken {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
  role?: TUserRole;
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
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<IPaginatedReply<T>>;

  getOne: <T>(
    id: string,
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<{ data: T | null }>;

  update: <T>(
    _id: string,
    itemToUpdate: T,
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<boolean | void>;

  create: <T>(
    item: T,
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<string | boolean | void>;

  delete: (
    _id: string,
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<boolean | void>;
}
