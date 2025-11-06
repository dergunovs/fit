import {
  IActivity,
  IExerciseChoosen,
  IExerciseDone,
  IExerciseStatistics,
  IMuscle,
  TLocale,
} from 'fitness-tracker-contracts';
import { formatDuration, subtractDates } from 'mhz-helpers';

import { IActivityCalendarEvent } from '@/activity/interface';
import { generateExerciseChoosen } from '@/exercise/helpers';

function generateActivityCSSGradients(colors: { percent: number; color: string | undefined }[]) {
  if (colors.length === 0) return '#000';

  const firstColor = colors[0].color;

  if (colors.length === 1) return firstColor;

  const firstPercent = `${colors[0].percent}%`;

  const secondColor = colors[1]?.color;

  const secondPercent = `${colors[0].percent + colors[1]?.percent}%`;

  if (colors.length === 2)
    return `linear-gradient(135deg, ${firstColor} ${firstPercent}, ${secondColor} ${firstPercent}, ${secondColor} ${secondPercent})`;

  const thirdColor = colors[2]?.color;

  const thirdPercent =
    colors[0].percent + colors[1]?.percent + colors[2]?.percent > 100
      ? '100%'
      : `${colors[0].percent + colors[1]?.percent + colors[2]?.percent}%`;

  return `linear-gradient(135deg, ${firstColor} ${firstPercent}, ${secondColor} ${firstPercent}, ${secondColor} ${secondPercent}, ${thirdColor} ${secondPercent}, ${thirdColor} ${thirdPercent})`;
}

function checkActivityStatus(isFinished: boolean, dateScheduled?: Date | string): string | null {
  if (dateScheduled) {
    const scheduled = new Date(dateScheduled);
    const now = new Date();

    if (scheduled > now) return 'gray';
    if (scheduled < now) return 'darkred';
  }

  if (!isFinished) return 'black';

  return null;
}

function calculateMuscleRepeats(exercises: IExerciseDone[], muscles: IMuscle[]): { repeats: number; color: string }[] {
  const muscleMap = new Map(muscles.map((muscle) => [muscle._id, { color: muscle.color, repeats: 0 }]));

  for (const exercise of exercises) {
    if (!exercise.exercise?.muscles) continue;

    const muscleIds = new Set(exercise.exercise.muscles.map((m) => m._id));

    for (const [muscleId, stats] of muscleMap) {
      if (muscleIds.has(muscleId)) {
        stats.repeats += exercise.repeats || 0;
      }
    }
  }

  return [...muscleMap.values()]
    .filter((stats) => stats.repeats > 0)
    .map((stats) => ({ repeats: stats.repeats, color: stats.color }));
}

function prepareColorData(groups: { repeats: number; color: string }[]) {
  const primaryGroups = groups.sort((a, b) => b.repeats - a.repeats).slice(0, 3);

  if (primaryGroups.length === 0) return [];

  const totalRepeats = primaryGroups.reduce((sum, group) => sum + group.repeats, 0);

  return primaryGroups.map((group) => {
    const percent = Math.round((group.repeats / totalRepeats) * 100);

    return { percent, color: group.color };
  });
}

export function getPotentialActivityDuration(
  exercises: IExerciseDone[],
  locale: TLocale,
  exerciseStatistics?: IExerciseStatistics[],
  averageRestPercent?: number
): string {
  if (!averageRestPercent || !exerciseStatistics) return '-';

  const exerciseStatsMap = new Map(exerciseStatistics.map((stat) => [stat.exercise._id, stat.averageDuration || 0]));

  const totalDuration = exercises.reduce((acc, exercise) => {
    const averageDuration = exerciseStatsMap.get(exercise.exercise?._id) || 0;

    return acc + averageDuration * (exercise.repeats || 0);
  }, 0);

  const durationWithRest = Math.round(totalDuration / (1 - averageRestPercent / 100));

  return formatDuration(durationWithRest, locale);
}

export function getActivityColor(
  exercises: IExerciseDone[],
  muscles: IMuscle[],
  isFinished: boolean,
  dateScheduled?: Date | string
) {
  const statusColor = checkActivityStatus(isFinished, dateScheduled);

  if (statusColor) return statusColor;

  const groups = calculateMuscleRepeats(exercises, muscles);

  const colors = prepareColorData(groups);

  return generateActivityCSSGradients(colors);
}

export function convertActivityCalendarEvents(
  muscles: IMuscle[],
  activities?: IActivity[]
): IActivityCalendarEvent<IExerciseDone>[] | undefined {
  return activities?.map((activity: IActivity) => {
    const isScheduled = !!activity.dateScheduled;

    const scheduled = new Date(`${activity.dateScheduled}`);
    const created = new Date(`${activity.dateCreated}`);
    const updated = activity.dateUpdated ? new Date(`${activity.dateUpdated}`) : created;

    const start = isScheduled ? scheduled : created;
    const end = isScheduled ? scheduled : updated;

    if (isScheduled) end.setHours(23, 59, 59);

    const isFinished = created !== updated;

    return {
      _id: activity._id,
      start,
      end,
      title: activity.exercises.length.toString(),
      content: activity.exercises,
      color: getActivityColor(activity.exercises, muscles, isFinished, activity.dateScheduled),
    };
  });
}

export function generateActivityExercises(exercisesDone: IExerciseDone[]): IExerciseChoosen[] {
  const activityExercises = exercisesDone.map((exercise) => {
    return generateExerciseChoosen(exercise.repeats, exercise.weight, exercise.exercise);
  });

  return activityExercises?.length ? [...activityExercises] : [];
}

export function getToFailurePercent(exercises: IExerciseDone[]) {
  const allExercises = exercises.length;

  if (!allExercises) return '0%';

  let toFailureExercises = 0;

  for (const exercise of exercises) {
    if (exercise.isToFailure) {
      toFailureExercises++;
    }
  }

  return `${Math.floor((toFailureExercises / allExercises) * 100)}%`;
}

export function getRestPercent(
  exercises: IExerciseDone[],
  lang: TLocale,
  start?: Date | null | string,
  end?: Date | null | string
) {
  if (exercises.length < 2) return '0%';

  const activityDuration = Number(subtractDates(end, start, lang, true));
  const exercisesDuration = exercises.reduce((acc, current) => acc + (current.duration || 0), 0);

  return `${Math.floor(100 - (exercisesDuration / activityDuration) * 100)}%`;
}
