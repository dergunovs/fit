import { IBaseReply, IEntity, IBaseService } from "./base";
export { API_MUSCLE } from "../index";

export interface IMuscle extends IEntity {
  title: string;
  color: string;
}

export interface IMuscleStatistics {
  title: string;
  color: string;
  sets: number;
  repeats: number;
}

export interface IMuscleService
  extends Pick<IBaseService, "getOne" | "update" | "create" | "delete"> {
  getAll: (decode?: TDecode, token?: string) => Promise<{ data: IMuscle[] }>;
}

export type TGetMusclesDTO = { data: IMuscle[] };
export type TGetMuscleDTO = { data: IMuscle | null };

export type TPostMuscleDTO = IBaseReply;
export type TPostMuscleDataDTO = IMuscle;

export type TUpdateMuscleDTO = IBaseReply;
export type TUpdateMuscleDataDTO = IMuscle;

export type TDeleteMuscleDTO = IBaseReply;
