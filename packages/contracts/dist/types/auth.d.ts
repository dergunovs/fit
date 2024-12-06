import { IBaseReply, IToken } from "./base";
export { API_AUTH_GET, API_AUTH_LOGIN, API_AUTH_SETUP } from "../index";

export interface IAuthData {
  email: string;
  password: string;
}

export interface IAuthService {
  check: (request: { jwtVerify: () => Promise<IToken> }) => Promise<IToken>;

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

export type TGetAuthDTO = IToken;

export type TPostAuthLoginDTO = IToken;
export type TPostAuthLoginDataDTO = IAuthData;
export type TPostAuthSetupDTO = IBaseReply;
export type TPostAuthSetupDataDTO = IAuthData;
