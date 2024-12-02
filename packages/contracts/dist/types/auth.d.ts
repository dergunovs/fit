import { IBaseReply, IToken } from "./base";

export interface ILoginData {
  email: string;
  password: string;
}

export interface IAuthService {
  check: (request: { jwtVerify: () => Promise<void> }) => Promise<void>;

  login: (
    loginData: ILoginData,
    signData: (payload: IToken, options: object) => string,
  ) => Promise<{
    user?: IToken;
    isUserNotFound: boolean;
    isWrongPassword: boolean;
  }>;

  setup: (admin: ILoginData) => Promise<boolean>;
}

export type TGetAuthDTO = IBaseReply;
export type TPostAuthLoginDTO = IToken;
export type TPostAuthSetupDTO = IBaseReply;

export declare const API_GET_AUTH = "/auth/check";
export declare const API_AUTH_LOGIN = "/auth/login";
export declare const API_AUTH_SETUP = "/auth/setup";
