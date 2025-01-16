import { IEquipment } from 'fitness-tracker-contracts';

export function filterEquipmentByWeights(equipments?: IEquipment[], isWeights?: boolean) {
  if (!equipments?.length) return [];

  return equipments?.filter((equipment) => (isWeights ? equipment.isWeights : !equipment.isWeights));
}
