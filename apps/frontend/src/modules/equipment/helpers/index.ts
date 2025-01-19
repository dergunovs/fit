import { IEquipment, IUserEquipment } from 'fitness-tracker-contracts';

export function filterEquipmentByWeights(equipments?: IEquipment[], isWeights?: boolean) {
  if (!equipments?.length) return [];

  return equipments?.filter((equipment) => (isWeights ? equipment.isWeights : !equipment.isWeights));
}

export function getWeightsForUserEquipment(equipments?: IUserEquipment[]) {
  const weights = equipments?.reduce((acc: number[], eq) => (eq.weights ? [...acc, ...eq.weights] : []), []);

  const sortedWeights = [...new Set(weights?.sort((a, b) => a - b))];

  return sortedWeights;
}
