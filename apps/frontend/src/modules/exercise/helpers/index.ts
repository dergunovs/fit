import {
  IExercise,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
  IUser,
  IUserEquipment,
} from 'fitness-tracker-contracts';
import { createTempId } from 'mhz-helpers';

import { ITimelineStep } from '@/activity/interface';
import { getWeightsForUserEquipment } from '@/equipment/helpers';

export function getUserEquipmentParams(exercise: IExercise, user?: IUser) {
  const isExerciseHasEquipment = !!exercise.equipment;
  const isExerciseHasEquipmentForWeight = !!exercise.equipmentForWeight?.length;
  const isWeightsRequired = !!exercise.isWeightsRequired;

  const isUserHasEquipment = !!user?.equipments?.some(
    (equipment) => equipment.equipment?._id?.toString() === exercise.equipment?._id?.toString()
  );

  const isUserHasEquipmentForWeight = !!user?.equipments?.some((equipment) =>
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

export function isUserEquipmentMatches(exercise: IExercise, user?: IUser) {
  let result = false;

  const {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  } = getUserEquipmentParams(exercise, user);

  if (!isExerciseHasEquipment && !isExerciseHasEquipmentForWeight) {
    result = true;
  } else if (isUserHasEquipment && !isWeightsRequired) {
    result = true;
  } else if (!isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipmentForWeight) {
    result = true;
  } else if (!isExerciseHasEquipment && !isWeightsRequired) {
    result = true;
  } else if (
    isExerciseHasEquipment &&
    isExerciseHasEquipmentForWeight &&
    isUserHasEquipment &&
    isUserHasEquipmentForWeight
  ) {
    result = true;
  }

  return result;
}

export function getAverageDuration(exercise: IExerciseStatistics, type: 'set' | 'repeat') {
  return type === 'set'
    ? `${((exercise.averageDuration * exercise.repeats) / exercise.sets || 0).toFixed(1)}`
    : `${exercise.averageDuration.toFixed(1)}`;
}

export function getAverageRepeatsInSet(repeats?: number, sets?: number) {
  return repeats && sets ? Math.round(repeats / sets) : 0;
}

export function isPrevExerciseSame(exercises: IExerciseDone[], index: number, id?: string) {
  return id && exercises[index - 1] ? id === exercises[index - 1].exercise?._id : false;
}

export function isSetCreatable(choosenExercises: IExerciseChoosen[], index: number, id?: string) {
  return !isPrevExerciseSame(choosenExercises, index, id) && index > 0 && index + 1 === choosenExercises.length;
}

export function generateTimeline(exercises: IExerciseDone[], start: Date | string | null, ratio: number) {
  const allSteps: ITimelineStep[] = [];

  exercises.forEach((exercise, index) => {
    if (!exercise.dateUpdated || !exercise.duration || !start) return;

    allSteps.push({
      left:
        index === 0
          ? 0
          : (new Date(exercise.dateUpdated).getTime() - exercise.duration * 1000 - new Date(start).getTime()) / ratio,
      right:
        index === exercises.length - 1 && exercises.length !== 1
          ? 0
          : (new Date(exercise.dateUpdated).getTime() - new Date(start).getTime()) / ratio,
      type: 'exercise',
    });
  });

  allSteps.forEach((step, index) => {
    if (!allSteps[index - 1]?.right) return;

    allSteps.push({ left: allSteps[index - 1].right, right: step.left, type: 'rest' });
  });

  return allSteps.sort((a, b) => a.left - b.left);
}

export function filterExercisesByTitleAndMuscle(exercises: IExercise[], title: string, muscle?: string, user?: IUser) {
  return exercises.filter((exercise) => {
    const isEquipmentMatches = isUserEquipmentMatches(exercise, user);

    const titleFilter =
      (exercise.title.toLowerCase().includes(title.toLocaleLowerCase()) ||
        exercise.title_en?.toLowerCase().includes(title.toLocaleLowerCase())) &&
      isEquipmentMatches;
    const muscleFilter = exercise.muscles?.some((group) => group._id === muscle) && isEquipmentMatches;

    return muscle ? muscleFilter && titleFilter : titleFilter;
  });
}

export function getAvailableExerciseWeights(exercise: IExercise, user: IUser) {
  const equipments = user.equipments?.filter((equipment) =>
    exercise.equipmentForWeight?.some((eq) => eq._id === equipment.equipment?._id)
  );

  if (!equipments?.length) return [];

  const weights = getWeightsForUserEquipment(equipments);

  return exercise.isWeightsRequired ? weights : [0, ...weights];
}

export function getExercisesToChooseDefaultWeight(exercises: IExercise[], userEquipments?: IUserEquipment[]) {
  const equipmentsForWeight = userEquipments?.filter((eq) => eq.weights?.length);
  const exercisesWithWeight = exercises.filter((ex) => ex.isWeights);

  const tableData = exercisesWithWeight.map((ex) => {
    const exerciseEquipment = ex.equipmentForWeight
      ?.filter((eq) => equipmentsForWeight?.some((equipment) => equipment.equipment?._id === eq._id))
      .map((exToMap) => exToMap._id);

    const availableEquipment = equipmentsForWeight?.filter((eq) =>
      exerciseEquipment?.some((equipmentId) => equipmentId === eq.equipment?._id)
    );

    const options = getWeightsForUserEquipment(availableEquipment);

    return {
      _id: ex._id,
      title: ex.title,
      title_en: ex.title_en,
      options: ex.isWeightsRequired ? options : [0, ...options],
    };
  });

  return tableData.filter((ex) => ex.options.length > 1);
}

export function getDefaultExerciseWeight(exercise: IExercise, user: IUser, weights?: number[]) {
  let weight = weights?.length && exercise.isWeightsRequired ? weights[0] : 0;

  if (user.defaultWeights && exercise._id && Object.hasOwn(user.defaultWeights, exercise._id)) {
    weight = user.defaultWeights[exercise._id];
  }

  return weight;
}

export function addSetToExercises(exercises: IExerciseChoosen[]) {
  const set = exercises.slice(-2).map((exercise) => {
    return { ...exercise, _id: createTempId() };
  });

  return [...exercises, ...set];
}

export function updateExercisesIndex(exercises: IExerciseChoosen[], index: number) {
  if (index <= 0 || index >= exercises.length) return exercises;

  const updatedExercises = [...exercises];
  const exerciseToMove = updatedExercises[index];

  updatedExercises.splice(index, 1);
  updatedExercises.splice(index - 1, 0, exerciseToMove);

  return updatedExercises;
}

export function updateExerciseField<T extends keyof IExerciseDone>(
  exercises: IExerciseChoosen[],
  field: T,
  value: IExerciseDone[T],
  id?: string
): IExerciseChoosen[] {
  return exercises.map((exercise) => (exercise._id === id ? { ...exercise, [field]: value } : exercise));
}

export function generateExerciseChoosen(repeats: number, weight?: number, exercise?: IExercise): IExerciseChoosen {
  return {
    _id: createTempId(),
    exercise: {
      _id: exercise?._id || '',
      title: exercise?.title || '',
      title_en: exercise?.title_en || '',
      muscles: exercise?.muscles || [],
      isWeights: exercise?.isWeights || false,
      isWeightsRequired: exercise?.isWeightsRequired || false,
      equipmentForWeight: exercise?.equipmentForWeight,
    },
    repeats,
    weight,
  };
}
