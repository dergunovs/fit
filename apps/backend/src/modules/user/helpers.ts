import { IExercise, IUser } from 'fitness-tracker-contracts';

function getUserEquipmentParams(exercise: IExercise, user?: IUser | null) {
  const isExerciseHasEquipment = !!exercise.equipment;
  const isExerciseHasEquipmentForWeight = !!exercise.equipmentForWeight?.length;
  const isWeightsRequired = !!exercise.isWeightsRequired;

  if (!user?.equipments?.length) {
    return {
      isExerciseHasEquipment,
      isExerciseHasEquipmentForWeight,
      isWeightsRequired,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    };
  }

  const isUserHasEquipment = user.equipments.some(
    (equipment) => equipment.equipment?._id?.toString() === exercise.equipment?._id?.toString()
  );

  const isUserHasEquipmentForWeight = user.equipments.some((equipment) =>
    exercise.equipmentForWeight?.some(
      (equipmentForWeight) => equipmentForWeight._id?.toString() === equipment.equipment?._id?.toString()
    )
  );

  return {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  };
}

export function isUserEquipmentMatches(exercise: IExercise, user?: IUser | null) {
  const {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  } = getUserEquipmentParams(exercise, user);

  if (!isExerciseHasEquipment && !isExerciseHasEquipmentForWeight) return true;
  if (isUserHasEquipment && !isWeightsRequired) return true;
  if (!isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipmentForWeight) return true;
  if (!isExerciseHasEquipment && !isWeightsRequired) return true;
  if (isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipment && isUserHasEquipmentForWeight)
    return true;

  return false;
}
