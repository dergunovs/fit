import { IEquipment, IUserEquipment } from 'fitness-tracker-contracts';

export function excludeChoosenUserEquipment(equipments: IEquipment[], userEquipments?: IUserEquipment[]) {
  if (!userEquipments?.length) return equipments;

  const userEquipmentIds = new Set(userEquipments.map((ue) => ue.equipment?._id));

  return equipments.filter((equipment) => !userEquipmentIds.has(equipment._id));
}
