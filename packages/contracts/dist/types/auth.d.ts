import { IBaseReply } from "./base";
import { IUser } from "./user";

export { API_AUTH_GET, API_AUTH_LOGIN, API_AUTH_SETUP } from "../index";

export interface IAuthData {
  email: string;
  password: string;
}

export type TDecode = (token: string) => IUser | null;

export interface IAuthService {
  check: (request: {
    jwtVerify: () => Promise<IUser>;
  }) => Promise<{ user?: IUser; isUserNotFound: boolean }>;

  login: (
    loginData: IAuthData,
    signData: (payload: IUser, options: object) => string,
  ) => Promise<{
    user?: IUser;
    token?: string;
    isUserNotFound: boolean;
    isWrongPassword: boolean;
  }>;

  setup: (admin: IAuthData) => Promise<boolean>;
}

export type TGetAuthDTO = IUser;

export type TPostAuthLoginDTO = { user?: IUser; token?: string };
export type TPostAuthLoginDataDTO = IAuthData;
export type TPostAuthSetupDTO = IBaseReply;
export type TPostAuthSetupDataDTO = IAuthData;
