import {
  EXERCISE_MUSCLE_GROUPS,
  IActivity,
  IExerciseDone,
  IExerciseStatistics,
  IMuscleGroup,
} from 'fitness-tracker-contracts';
import { createTempId, formatDate, formatDuration, subtractDates } from 'mhz-helpers';
import { toast } from 'mhz-ui';

import { IActivityCalendarEvent } from '@/activity/interface';
import { setExercisesMuscleGroupColor } from '@/exercise/helpers';

export function getPotentialActivityDuration(
  exercises: IExerciseDone[],
  exerciseStatistics: IExerciseStatistics[],
  averageRestPercent?: number
): string {
  if (!averageRestPercent) return '-';

  const totalDuration = exercises.reduce((acc, exercise) => {
    const averageDuration =
      exerciseStatistics.find((choosenExericse) => choosenExericse.exercise._id === exercise.exercise?._id)
        ?.averageDuration || 0;

    return acc + averageDuration * exercise.repeats;
  }, 0);

  const durationWithRest = Math.round(totalDuration / (1 - averageRestPercent / 100));

  return formatDuration(durationWithRest);
}

export function getActivityColor(exercises: IExerciseDone[]) {
  const groups: { sets: number; color?: string }[] = [];

  EXERCISE_MUSCLE_GROUPS.forEach((group: IMuscleGroup) => {
    const color = group.color;
    let sets = 0;

    exercises.forEach((exercise: IExerciseDone) => {
      const setsCount =
        exercise.exercise?.muscleGroups?.filter((muscleGroup) => muscleGroup._id === group._id).length || 0;

      sets += setsCount;
    });

    if (sets) groups.push({ sets, color });
  });

  const primaryGroups = groups.slice(0, 2);

  const totalSets = primaryGroups.reduce((acc, current) => acc + current.sets, 0);

  const colors = primaryGroups.map((group) => {
    const percent = `${((group.sets / totalSets) * 100).toFixed(0)}%`;

    return { percent, color: group.color };
  });

  if (colors.length === 1) return colors[0].color;

  return `linear-gradient(90deg, ${colors[0].color} ${colors[0].percent}, ${colors[1]?.color} ${colors[1]?.percent})`;
}

export function convertActivityCalendarEvents(
  activities?: IActivity[]
): IActivityCalendarEvent<IExerciseDone>[] | undefined {
  return activities?.map((activity: IActivity) => {
    const content = setExercisesMuscleGroupColor(activity.exercises);

    return {
      _id: activity._id,
      start: new Date(`${activity.dateCreated}`),
      end: new Date(`${activity.dateUpdated}`),
      title: '+',
      content,
      color: getActivityColor(content),
    };
  });
}

export function generateActivityExercises(exercisesDone: IExerciseDone[]): IExerciseDone[] {
  const activityExercises = exercisesDone.map((exercise) => {
    return {
      _id: createTempId(),
      exercise: {
        _id: exercise.exercise?._id || '',
        title: exercise.exercise?.title || '',
        muscleGroups: exercise.exercise?.muscleGroups || [],
        isWeights: exercise.exercise?.isWeights || false,
        isWeightsRequired: exercise.exercise?.isWeightsRequired || false,
      },
      repeats: exercise.repeats,
      weight: exercise.weight,
    };
  });

  return activityExercises?.length ? [...activityExercises] : [];
}

export function getToFailurePercent(exercises: IExerciseDone[]) {
  const allExercises = exercises.length;
  const toFailureExercises = exercises.filter((exercise) => exercise.isToFailure).length;

  return `${Math.floor((toFailureExercises / allExercises) * 100)}%`;
}

export function getRestPercent(exercises: IExerciseDone[], start?: Date | null | string, end?: Date | null | string) {
  const activityDuration = Number(subtractDates(end, start, true));
  const exercisesDuration = exercises.reduce((acc, current) => acc + (current.duration || 0), 0);

  return `${Math.floor(100 - (exercisesDuration / activityDuration) * 100)}%`;
}

export async function copyActivityToClipboard(
  exercises: IExerciseDone[],
  start?: Date | null | string,
  end?: Date | null | string
) {
  const textHeader = `${formatDate(start, 'ru')}, длительность: ${subtractDates(end, start)}
Подходы: ${exercises.length}, отказы: ${getToFailurePercent(exercises)}, отдых: ${getRestPercent(exercises, start, end)}.

${exercises
  .map((exercise, index) => {
    return `${index + 1}. ${exercise.exercise?.title} x${exercise.repeats} ${exercise.weight ? `${exercise.weight}кг` : ''} ${formatDuration(exercise.duration)} ${exercise.isToFailure ? 'ДО ОТКАЗА' : ''}\n`;
  })
  .join('')}`;

  await navigator.clipboard.writeText(textHeader);

  toast.success('Скопировано в буфер');
}
