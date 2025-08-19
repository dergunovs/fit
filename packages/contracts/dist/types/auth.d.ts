import { IBaseReply } from "./base";
import { IUser } from "./user";

export {
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_SETUP,
  API_AUTH_REGISTER,
  API_AUTH_CONFIRM,
} from "..";

export interface IAuthData {
  email: string;
  password: string;
}

export interface IRegisterData extends IAuthData {
  name: string;
}

export type TDecode = (token: string) => IUser | null;

export type TGetAuthDTO = IUser;

export type TPostAuthLoginDTO = { user?: IUser; token?: string };
export type TPostAuthLoginDataDTO = IAuthData;

export type TPostAuthSetupDTO = IBaseReply;
export type TPostAuthSetupDataDTO = IAuthData;

export type TPostAuthRegisterDTO = IBaseReply;
export type TPostAuthRegisterDataDTO = IRegisterData;
export type TPostAuthRegisterQueryDTO = { lang: string };

export type TPostAuthConfirmTokenDTO = IBaseReply;
export type TPostAuthConfirmTokenDataDTO = { token: string };
