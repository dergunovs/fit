import { IBaseReply, IEntity, IPaginatedQuery, IPaginatedReply } from "./base";

export { API_USER } from "../index";

export type TUserRole = "admin" | "user";

export interface IUser extends IEntity {
  firstName?: string;
  lastName?: string;
  role: TUserRole;
  email: string;
  password?: string;
  dateLoggedIn?: Date | string;
}

export type TGetUsersDTO = IPaginatedReply<IUser>;
export type TGetUsersQueryDTO = IPaginatedQuery;
export type TGetUserDTO = { data: IUser | null };

export type TPostUserDTO = IBaseReply;
export type TPostUserDataDTO = IUser;

export type TUpdateUserDTO = IBaseReply;
export type TUpdateUserDataDTO = IUser;

export type TDeleteUserDTO = IBaseReply;
