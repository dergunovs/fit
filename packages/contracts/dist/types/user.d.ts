import { IBaseReply, IEntity, IPaginatedQuery, IPaginatedReply } from "./base";
import { IEquipment } from "./equipment";

export { API_USER } from "../index";

export type TUserRole = "admin" | "user";

export interface IUserEquipment {
  equipment?: IEquipment;
  weights?: number[];
}

export interface IUserDefaultWeight {
  exerciseId: string;
  weight: number;
}

export interface IUser extends IEntity {
  name?: string;
  role?: TUserRole;
  email: string;
  password?: string;
  equipments?: IUserEquipment[];
  defaultWeights?: IUserDefaultWeight[];
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
