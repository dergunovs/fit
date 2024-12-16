import { IBaseReply, IBaseService, IEntity, IToken } from "./base";
import { IUser } from "./user";

export { EXERCISE_MUSCLE_GROUPS, API_EXERCISE } from "../index";

export interface IMuscleGroup {
  _id: string;
  title: string;
}

export interface IExercise extends IEntity {
  title: string;
  createdBy?: IUser;
  muscleGroups?: IMuscleGroup[];
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

export interface IExerciseStatistics {
  _id: string;
  title: string;
  sets: number;
  setsDynamics: number;
  repeats: number;
  repeatsDynamics: number;
  averageDuration: number;
}

export interface IExerciseService
  extends Pick<IBaseService, "getOne" | "update" | "create" | "delete"> {
  getAll: (
    decode?: (token: string) => IToken | null,
    token?: string,
  ) => Promise<IExercise[]>;
}

export type TGetExercisesDTO = IExercise[];
export type TGetExerciseDTO = { data: IExercise | null };

export type TPostExerciseDTO = IBaseReply;
export type TPostExerciseDataDTO = IExercise;

export type TUpdateExerciseDTO = IBaseReply;
export type TUpdateExerciseDataDTO = IExercise;

export type TDeleteExerciseDTO = IBaseReply;
