import { IActivity, IExerciseDone, IExerciseStatistics, IMuscle } from 'fitness-tracker-contracts';
import { createTempId, formatDuration, subtractDates } from 'mhz-helpers';

import { IActivityCalendarEvent } from '@/activity/interface';

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

export function getPotentialActivityDuration(
  exercises: IExerciseDone[],
  locale: string,
  exerciseStatistics?: IExerciseStatistics[],
  averageRestPercent?: number
): string {
  if (!averageRestPercent || !exerciseStatistics) return '-';

  const totalDuration = exercises.reduce((acc, exercise) => {
    const averageDuration =
      exerciseStatistics?.find((choosenExercise) => choosenExercise.exercise._id === exercise.exercise?._id)
        ?.averageDuration || 0;

    return acc + averageDuration * exercise.repeats;
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
  const scheduled = new Date(`${dateScheduled}`);

  if (scheduled > new Date()) return 'gray';
  if (scheduled < new Date()) return 'darkred';
  if (!isFinished) return 'black';

  const groups: { repeats: number; color?: string }[] = [];

  muscles.forEach((muscle: IMuscle) => {
    const color = muscle.color;
    let repeats = 0;

    exercises.forEach((exercise: IExerciseDone) => {
      if (exercise.exercise?.muscles?.some((groupToFilter) => groupToFilter._id === muscle._id)) {
        repeats += exercise.repeats;
      }
    });

    if (repeats) groups.push({ repeats, color });
  });

  const primaryGroups = groups.sort((a, b) => b.repeats - a.repeats).slice(0, 3);

  const totalRepeats = primaryGroups.reduce((acc, current) => acc + current.repeats, 0);

  const colors = primaryGroups.map((group) => {
    const percent = Number(((group.repeats / totalRepeats) * 100).toFixed(0));

    return { percent, color: group.color };
  });

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
      startSeconds: start.getUTCSeconds(),
      end,
      endSeconds: end.getUTCSeconds(),
      title: activity.exercises.length.toString(),
      content: activity.exercises,
      color: getActivityColor(activity.exercises, muscles, isFinished, activity.dateScheduled),
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
        title_en: exercise.exercise?.title_en || '',
        muscles: exercise.exercise?.muscles || [],
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

  if (!allExercises) return '0%';

  const toFailureExercises = exercises.filter((exercise) => exercise.isToFailure).length;

  return `${Math.floor((toFailureExercises / allExercises) * 100)}%`;
}

export function getRestPercent(
  exercises: IExerciseDone[],
  lang: string,
  start?: Date | null | string,
  end?: Date | null | string
) {
  if (exercises.length < 2) return '0%';

  const activityDuration = Number(subtractDates(end, start, lang, true));
  const exercisesDuration = exercises.reduce((acc, current) => acc + (current.duration || 0), 0);

  return `${Math.floor(100 - (exercisesDuration / activityDuration) * 100)}%`;
}
