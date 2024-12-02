import { IBaseReply, IToken } from "./base";

export interface IAuthData {
  email: string;
  password: string;
}

export interface IAuthService {
  check: (request: { jwtVerify: () => Promise<void> }) => Promise<void>;

  login: (
    loginData: IAuthData,
    signData: (payload: IToken, options: object) => string,
  ) => Promise<{
    user?: IToken;
    isUserNotFound: boolean;
    isWrongPassword: boolean;
  }>;

  setup: (admin: IAuthData) => Promise<boolean>;
}

export type TGetAuthDTO = IBaseReply;

export type TPostAuthLoginDTO = IToken;
export type TPostAuthLoginDataDTO = IAuthData;
export type TPostAuthSetupDTO = IBaseReply;
export type TPostAuthSetupDataDTO = IAuthData;

export declare const API_AUTH_GET = "/auth/check";
export declare const API_AUTH_LOGIN = "/auth/login";
export declare const API_AUTH_SETUP = "/auth/setup";
