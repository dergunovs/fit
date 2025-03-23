import { IEquipment, IUserEquipment } from 'fitness-tracker-contracts';

export function excludeChoosenUserEquipment(equipments: IEquipment[], userEquipments?: IUserEquipment[]) {
  return equipments.filter(
    (equipment) => !userEquipments?.some((equipmentToFilter) => equipment._id === equipmentToFilter.equipment?._id)
  );
}
