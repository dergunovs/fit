import { IExercise, IUser } from 'fitness-tracker-contracts';

function getUserEquipmentParams(exercise: IExercise, user: IUser) {
  const isExerciseHasEquipment = !!exercise.equipment;
  const isExerciseHasEquipmentForWeight = !!exercise.equipmentForWeight?.length;
  const isWeightsRequired = !!exercise.isWeightsRequired;

  if (!user.equipments?.length) {
    return {
      isExerciseHasEquipment,
      isExerciseHasEquipmentForWeight,
      isWeightsRequired,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    };
  }

  const userEquipmentIds = new Set(user.equipments.map((equipment) => equipment.equipment?._id?.toString()));

  const isUserHasEquipment = exercise.equipment?._id ? userEquipmentIds.has(exercise.equipment._id.toString()) : false;

  const isUserHasEquipmentForWeight = exercise.equipmentForWeight
    ? exercise.equipmentForWeight.some((equipment) => userEquipmentIds.has(equipment._id?.toString()))
    : false;

  return {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  };
}

export function isUserEquipmentMatches(exercise: IExercise, user: IUser) {
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

export function getUserGoals(isMonth: boolean, isAverage: boolean, user: IUser) {
  const activities = user.goalActivities || 2;
  const sets = user.goalSets || 24;
  const repeats = user.goalRepeats || 12;
  const duration = user.goalDuration || 40;

  const totalActivities = isMonth ? Math.floor(activities * 4.5) : activities;

  return {
    activitiesGoal: totalActivities,
    setsGoal: isAverage ? sets : sets * totalActivities,
    repeatsGoal: isAverage ? repeats * sets : repeats * sets * totalActivities,
    durationGoal: isAverage ? duration : duration * totalActivities,
  };
}
