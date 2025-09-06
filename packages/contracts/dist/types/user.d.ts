import { IBaseReply, IEntity, IPaginatedQuery, IPaginatedReply } from "./base";
import { IEquipment } from "./equipment";
import { IExerciseChoosen } from "./exercise";

export { API_USER, API_USER_PASSWORD, API_USER_FEEDBACK } from "../index";

export type TUserRole = "admin" | "user";

export interface IUserTemplate extends IEntity {
  title: string;
  exercises: IExerciseChoosen[];
}

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
  passwordTemporary?: string;
  isResetPassword?: boolean;
  equipments?: IUserEquipment[];
  defaultWeights?: IUserDefaultWeights;
  templates?: IUserTemplate[];
  dateLoggedIn?: Date | string;
  isEmailConfirmed?: boolean;
  confirmationToken?: string;
  goalActivities?: number;
  goalSets?: number;
  goalRepeats?: number;
  goalDuration?: number;
}

export interface IUserFeedback {
  name: string;
  email: string;
  message: string;
}

export type TGetUsersDTO = IPaginatedReply<IUser>;
export type TGetUsersQueryDTO = IPaginatedQuery;
export type TGetUserDTO = { data: IUser };

export type TPostUserDTO = IBaseReply;
export type TPostUserDataDTO = IUser;

export type TPostUserFeedbackDTO = IBaseReply;
export type TPostUserFeedbackDataDTO = IUserFeedback;

export type TUpdateUserDTO = IBaseReply;
export type TUpdateUserDataDTO = IUser;

export type TUpdateUserPasswordDTO = IBaseReply;
export type TUpdateUserPasswordDataDTO = { password: string };

export type TDeleteUserDTO = IBaseReply;
