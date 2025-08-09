import { IBaseReply, IEntity } from "./base";
export { API_MUSCLE } from "../index";

export interface IMuscle extends IEntity {
  title: string;
  title_en?: string;
  color: string;
}

export interface IMuscleStatistics {
  title: string;
  title_en?: string;
  color: string;
  sets: number;
  repeats: number;
}

export type TGetMusclesDTO = { data: IMuscle[] };
export type TGetMuscleDTO = { data: IMuscle };

export type TPostMuscleDTO = IBaseReply;
export type TPostMuscleDataDTO = IMuscle;

export type TUpdateMuscleDTO = IBaseReply;
export type TUpdateMuscleDataDTO = IMuscle;

export type TDeleteMuscleDTO = IBaseReply;
