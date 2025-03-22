import { IBaseReply, IBaseService, IEntity } from "./base";
import { IUser } from "./user";
import { IMuscle } from "./muscle";
import { TDecode } from "./auth";
import { IEquipment } from "./equipment";

export { API_EXERCISE } from "../index";

export interface IExercise extends IEntity {
  title: string;
  description?: string;
  createdBy?: IUser;
  muscles?: IMuscle[];
  isWeights: boolean;
  isWeightsRequired: boolean;
  equipment?: IEquipment;
  equipmentForWeight?: IEquipment[];
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
  exercise: IExercise;
  sets: number;
  setsDynamics: number;
  repeats: number;
  repeatsDynamics: number;
  averageDuration: number;
  isUserEquipmentMatches: boolean;
}

export interface IExerciseService
  extends Pick<IBaseService, "getOne" | "update" | "create" | "delete"> {
  getAll: (decode?: TDecode, token?: string) => Promise<{ data: IExercise[] }>;
}

export type TGetExercisesDTO = { data: IExercise[] };
export type TGetExerciseDTO = { data: IExercise | null };

export type TPostExerciseDTO = IBaseReply;
export type TPostExerciseDataDTO = IExercise;

export type TUpdateExerciseDTO = IBaseReply;
export type TUpdateExerciseDataDTO = IExercise;

export type TDeleteExerciseDTO = IBaseReply;
