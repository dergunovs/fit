import {
  IBaseReply,
  IEntity,
  IPaginatedQuery,
  IPaginatedReply,
  IBaseService,
} from "./base";
import { IEquipment } from "./equipment";

export { API_USER, API_USER_PASSWORD } from "../index";

export type TUserRole = "admin" | "user";

export interface IUserEquipment {
  equipment?: IEquipment;
  weights?: number[];
}

export interface IUserDefaultWeights {
  [key: string]: number;
}

export interface IUser extends IEntity {
  name?: string;
  role?: TUserRole;
  email: string;
  password?: string;
  equipments?: IUserEquipment[];
  defaultWeights?: IUserDefaultWeights;
  dateLoggedIn?: Date | string;
  isEmailConfirmed?: boolean;
  confirmationToken?: string;
}

export interface IUserService extends IBaseService {
  updatePassword: (
    _id: string,
    password: string,
    decode?: TDecode,
    token?: string,
  ) => Promise<void>;
}

export type TGetUsersDTO = IPaginatedReply<IUser>;
export type TGetUsersQueryDTO = IPaginatedQuery;
export type TGetUserDTO = { data: IUser | null };

export type TPostUserDTO = IBaseReply;
export type TPostUserDataDTO = IUser;

export type TUpdateUserDTO = IBaseReply;
export type TUpdateUserDataDTO = IUser;

export type TUpdateUserPasswordDTO = IBaseReply;
export type TUpdateUserPasswordDataDTO = { password: string };

export type TDeleteUserDTO = IBaseReply;
