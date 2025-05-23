import { IBaseReply, IEntity } from "./base";
import { TDecode } from "./auth";

export { API_EQUIPMENT } from "../index";

export interface IEquipment extends IEntity {
  title: string;
  title_en?: string;
  isWeights: boolean;
}

export interface IEquipmentService
  extends Pick<IBaseService, "getOne" | "update" | "create" | "delete"> {
  getAll: (decode?: TDecode, token?: string) => Promise<{ data: IEquipment[] }>;
}

export type TGetEquipmentsDTO = { data: IEquipment[] };
export type TGetEquipmentDTO = { data: IEquipment | null };

export type TPostEquipmentDTO = IBaseReply;
export type TPostEquipmentDataDTO = IEquipment;

export type TUpdateEquipmentDTO = IBaseReply;
export type TUpdateEquipmentDataDTO = IEquipment;

export type TDeleteEquipmentDTO = IBaseReply;
