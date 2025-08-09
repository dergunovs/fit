import { IBaseReply, IEntity } from "./base";

export { API_EQUIPMENT } from "../index";

export interface IEquipment extends IEntity {
  title: string;
  title_en?: string;
  isWeights: boolean;
}

export type TGetEquipmentsDTO = { data: IEquipment[] };
export type TGetEquipmentDTO = { data: IEquipment | null };

export type TPostEquipmentDTO = IBaseReply;
export type TPostEquipmentDataDTO = IEquipment;

export type TUpdateEquipmentDTO = IBaseReply;
export type TUpdateEquipmentDataDTO = IEquipment;

export type TDeleteEquipmentDTO = IBaseReply;
