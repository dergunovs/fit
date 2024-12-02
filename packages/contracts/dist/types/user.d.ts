import {
  IBaseReply,
  IBaseService,
  IEntity,
  IToken,
  IPaginatedQuery,
  IPaginatedReply,
} from "./base";

export interface IUser extends IEntity {
  email: string;
  password?: string;
}

export interface IUserService extends IBaseService {
  getCurrent: (
    decode: (token: string) => IToken | null,
    token?: string,
  ) => Promise<IUser | null>;
}

export type TGetUsersDTO = IPaginatedReply<IUser>;
export type TGetUsersQueryDTO = IPaginatedQuery;
export type TGetUserDTO = { data: IUser | null };
export type TPostUserDTO = IBaseReply;
export type TUpdateUserDTO = IBaseReply;
export type TDeleteUserDTO = IBaseReply;

export declare const API_USER = "/user";
