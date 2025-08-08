import { IBaseReply } from "./base";
import { IUser } from "./user";

export {
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_SETUP,
  API_AUTH_REGISTER,
  API_AUTH_CONFIRM,
  API_AUTH_RESET,
} from "../index";

export interface IAuthData {
  email: string;
  password: string;
}

export interface IRegisterData extends IAuthData {
  name: string;
}

export type TDecode = (token: string) => IUser | null;

export interface IAuthService {
  check: (request: {
    jwtVerify: () => Promise<IUser>;
  }) => Promise<IUser | undefined>;

  login: (
    loginData: IAuthData,
    sign: (payload: IUser, options: object) => string,
  ) => Promise<{
    user?: IUser;
    token?: string;
    isWrongPassword: boolean;
    isEmailNotConfirmed: boolean;
  }>;

  setup: (admin: IAuthData) => Promise<void>;

  register: (
    user: IRegisterData,
    lang: string,
    sign: (payload: IUser, options: object) => string,
  ) => Promise<void>;

  confirm: (token: string, decode?: TDecode) => Promise<void>;

  reset: (email: string, lang: string) => Promise<void>;
}

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

export type TPostAuthResetPasswordDTO = IBaseReply;
export type TPostAuthResetPasswordDataDTO = { email: string };
export type TPostAuthResetPasswordQueryDTO = { lang: string };
