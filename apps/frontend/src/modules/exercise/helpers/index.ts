import {
  IExercise,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
  IUser,
  IUserEquipment,
} from 'fitness-tracker-contracts';

import { ITimelineStep } from '@/activity/interface';
import { getWeightsForUserEquipment } from '@/equipment/helpers';

export function isUserHasEquipment(exercise: IExercise, user?: IUser | null) {
  return user?.equipments?.some((equipment) => equipment.equipment?.title === exercise.equipment?.title);
}

export function isUserHasEquipmentForWeight(exercise: IExercise, user?: IUser | null) {
  return (
    user?.equipments?.some((equipment) =>
      exercise.equipmentForWeight?.some((equipmentForWeight) => equipmentForWeight.title === equipment.equipment?.title)
    ) || false
  );
}

export function isUserEquipmentMatches(exercise: IExercise, user?: IUser | null) {
  let result = false;

  const isExerciseHasEquipment = exercise.equipment;
  const isExerciseHasEquipmentForWeight = exercise.equipmentForWeight?.length;
  const isWeightsRequired = exercise.isWeightsRequired;

  if (!isExerciseHasEquipment && !isExerciseHasEquipmentForWeight) {
    result = true;
  } else if (isUserHasEquipment(exercise, user)) {
    result = true;
  } else if (
    !isExerciseHasEquipment &&
    isExerciseHasEquipmentForWeight &&
    isUserHasEquipmentForWeight(exercise, user)
  ) {
    result = true;
  } else if (!isExerciseHasEquipment && !isWeightsRequired) {
    result = true;
  }

  return result;
}

export function getAverageDuration(exercise: IExerciseStatistics, type: 'set' | 'repeat') {
  return type === 'set'
    ? `${((exercise.averageDuration * exercise.repeats) / exercise.sets || 0).toFixed(1)}с`
    : `${exercise.averageDuration.toFixed(1)}с`;
}

export function isPrevExerciseSame(exercises: IExerciseDone[], index: number, id?: string) {
  return id && exercises[index - 1] ? id === exercises[index - 1].exercise?._id : false;
}

export function isSetCreatable(choosenExercises: IExerciseChoosen[], index: number, id?: string) {
  return !isPrevExerciseSame(choosenExercises, index, id) && index > 0 && index + 1 === choosenExercises.length;
}

export function getExercisePassingTitle(index: number, isCurrent: boolean, count: number, exercise: IExerciseDone) {
  return `${index}${isCurrent ? ` из ${count}.` : `.`} ${exercise.exercise?.title || 'Упражнение удалено'}${exercise.weight ? ` ${exercise.weight} кг.` : `.`}`;
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
        index === exercises.length - 1
          ? 0
          : (new Date(exercise.dateUpdated).getTime() - new Date(start).getTime()) / ratio,
      type: 'exercise',
    });
  });

  allSteps.forEach((step, index) => {
    if (!allSteps[index - 1]?.right) return;

    allSteps.push({
      left: allSteps[index - 1].right,
      right: step.left,
      type: 'rest',
    });
  });

  return allSteps.sort((a, b) => a.left - b.left);
}

export function filterExercisesByTitleAndMuscle(exercises: IExercise[], title: string, muscle?: string, user?: IUser) {
  return exercises.filter((exercise) => {
    const isEquipmentMatches = isUserEquipmentMatches(exercise, user);

    const titleFilter = exercise.title.toLowerCase().includes(title.toLocaleLowerCase()) && isEquipmentMatches;
    const muscleFilter = exercise.muscles?.some((group) => group._id === muscle) && isEquipmentMatches;

    return muscle ? muscleFilter && titleFilter : titleFilter;
  });
}

export function getAvailableExerciseWeights(exercise: IExercise, user: IUser) {
  const equipments = user.equipments?.filter((equipment) =>
    exercise.equipmentForWeight?.some((eq) => eq.title === equipment.equipment?.title)
  );

  if (!equipments?.length) return undefined;

  const weights = getWeightsForUserEquipment(equipments);

  return exercise.isWeightsRequired ? weights : [0, ...weights];
}

export function getExercisesToChooseDefaultWeight(exercises: IExercise[], userEquipments?: IUserEquipment[]) {
  const equipmentsForWeight = userEquipments?.filter((eq) => eq.weights?.length);
  const exercisesWithWeight = exercises.filter((ex) => ex.isWeights);

  const tableData = exercisesWithWeight.map((ex) => {
    const exerciseEquipment = ex.equipmentForWeight
      ?.filter((eq) => equipmentsForWeight?.some((equipment) => equipment.equipment?.title === eq.title))
      .map((exToMap) => exToMap.title);

    const availableEqupment = equipmentsForWeight?.filter((eq) =>
      exerciseEquipment?.some((equipmentTitle) => equipmentTitle === eq.equipment?.title)
    );

    const options = getWeightsForUserEquipment(availableEqupment);

    return { _id: ex._id, title: ex.title, options: ex.isWeightsRequired ? options : [0, ...options] };
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
