import { EXERCISE_MUSCLE_GROUPS, IExerciseDone, IExerciseStatistics, IMuscleGroup } from 'fitness-tracker-contracts';

import { ITimelineStep } from '@/activity/interface';

export function getAverageDuration(exercise: IExerciseStatistics, type: 'set' | 'repeat') {
  return type === 'set'
    ? `${((exercise.averageDuration * exercise.repeats) / exercise.sets || 0).toFixed(1)}с`
    : `${exercise.averageDuration.toFixed(1)}с`;
}

export function generateMuscleGroupStatistics(exercises: IExerciseDone[]) {
  const groups: {
    title: string;
    sets: number;
    repeats: number;
  }[] = [];

  EXERCISE_MUSCLE_GROUPS.forEach((group: IMuscleGroup) => {
    const title = group.title;
    let sets = 0;
    let repeats = 0;

    exercises.forEach((exercise: IExerciseDone) => {
      const setsCount =
        exercise.exercise?.muscleGroups?.filter((muscleGroup) => muscleGroup._id === group._id).length || 0;

      sets += setsCount;

      if (exercise.exercise?.muscleGroups?.some((groupToFilter) => groupToFilter._id === group._id)) {
        repeats += exercise.repeats;
      }
    });

    if (sets) groups.push({ title, sets, repeats });
  });

  return groups.sort((a, b) => b.repeats - a.repeats);
}

export function isPrevExerciseSame(exercises: IExerciseDone[], index: number, id?: string) {
  return id && exercises[index - 1] ? id === exercises[index - 1].exercise?._id : false;
}

export function getExercisePassingTitle(index: number, isCurrent: boolean, count: number, exercise: IExerciseDone) {
  return `${index}${isCurrent ? ` из ${count}.` : `.`}
${exercise.exercise?.title || 'Упражнение удалено'}${exercise.weight ? ` ${exercise.weight} кг.` : `.`}`;
}

export function generateTimeline(exercises: IExerciseDone[], start: Date | string | null, ratio: number) {
  const allSteps: ITimelineStep[] = [];

  exercises.forEach((exercise) => {
    allSteps.push({
      left:
        exercise.dateUpdated && exercise.duration && start
          ? (new Date(exercise.dateUpdated).getTime() - exercise.duration * 1000 - new Date(start).getTime()) / ratio
          : 0,
      right:
        exercise.dateUpdated && start
          ? (new Date(exercise.dateUpdated).getTime() - new Date(start).getTime()) / ratio
          : 0,
      type: 'exercise',
    });
  });

  allSteps.forEach((step, index) => {
    allSteps.push({
      left: index === 0 ? 0 : allSteps[index - 1].right,
      right: step.left,
      type: 'rest',
    });
  });

  return allSteps.sort((a, b) => a.left - b.left);
}
