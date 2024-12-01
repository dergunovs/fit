export * from "../index";

export interface IEntity {
  _id?: string;
  dateCreated?: Date | string;
  dateUpdated?: Date | string;
}

export interface IUser extends IEntity {
  email: string;
  password?: string;
}

export interface IMuscleGroup {
  _id: string;
  title: string;
  icon: string;
}

export interface IExercise extends IEntity {
  title: string;
  muscleGroups: IMuscleGroup[];
  weights?: number[];
  defaultWeight?: number;
}

export interface IExerciseChoosen extends IEntity {
  exercise?: IExercise;
  repeats: number;
  weight?: number;
}

export interface IExerciseDone extends IExerciseChoosen {
  isToFailure?: boolean;
  duration?: number;
  isDone?: boolean;
}

export interface IActivity extends IEntity {
  exercises: IExerciseDone[];
  isDone: boolean;
}

export interface IActivityStatistics {
  activitiesCount: number;
  setsCount: number;
  repeatsCount: number;
  duration: number;
  averageSetsPerActivity: number;
  averageRepeatsPerSet: number;
  averageDuration: number;
  averageRestPercent: number;
}

export interface IActivityChart {
  labels: string[];
  data: number[];
}

export type TActivityChartType = "activity" | "set" | "repeat";

export interface IExerciseStatistics {
  _id: string;
  title: string;
  sets: number;
  repeats: number;
  averageDuration: number;
}

export interface IUserToken {
  _id: string;
  email: string;
  token?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IBaseReply {
  message: string;
}

export interface IBaseParams {
  id: string;
}

export interface IPaginatedQuery {
  page: number;
}

export interface IPaginatedReply<T> {
  data: T[];
  total: number;
}

export interface IBaseService {
  getMany: <T>(
    page: number,
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<IPaginatedReply<T>>;

  getOne: <T>(
    id: string,
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<{ data: T | null }>;

  update: <T>(
    _id: string,
    itemToUpdate: T,
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<boolean | void>;

  create: <T>(
    item: T,
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<string | boolean | void>;

  delete: (
    _id: string,
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<boolean | void>;
}

export interface IActivityService extends IBaseService {
  getCalendar: (dateFrom: string, dateTo: string) => Promise<IActivity[]>;

  getStatistics: () => Promise<{
    activity: IActivityStatistics;
    exercise: IExerciseStatistics[];
  }>;

  getChart: (type: TActivityChartType) => Promise<IActivityChart>;

  getLast: <T>(
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<{ data: T | null }>;
}

export interface IExerciseService
  extends Pick<IBaseService, "getOne" | "update" | "create" | "delete"> {
  getAll: (
    decode?: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<IExercise[]>;
}

export interface IUserService extends IBaseService {
  getCurrent: (
    decode: (token: string) => IUserToken | null,
    token?: string,
  ) => Promise<IUser | null>;
}

export interface IAuthService {
  check: (request: { jwtVerify: () => Promise<void> }) => Promise<void>;

  login: (
    loginData: ILoginData,
    signData: (payload: IUserToken, options: object) => string,
  ) => Promise<{
    user?: IUserToken;
    isUserNotFound: boolean;
    isWrongPassword: boolean;
  }>;

  setup: (admin: ILoginData) => Promise<boolean>;
}

export declare const API_AUTH_CHECK = "/auth/check";
export declare const API_AUTH_LOGIN = "/auth/login";
export declare const API_AUTH_SETUP = "/auth/setup";
export declare const API_USER = "/user";
export declare const API_EXERCISE = "/exercise";
export declare const API_ACTIVITY = "/activity";
export declare const API_ACTIVITY_CALENDAR = "/activity_calendar";
export declare const API_ACTIVITY_STATISTICS = "/activity_statistics";
export declare const API_ACTIVITY_CHART = "/activity_chart";
export declare const API_ACTIVITY_LAST = "/activity_last";
