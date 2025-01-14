import { IActivity, IExerciseDone, IExerciseStatistics } from 'fitness-tracker-contracts';
import { createTempId, formatDate, formatDuration, subtractDates } from 'mhz-helpers';
import { toast } from 'mhz-ui';

export function getPotentialActivityDuration(
  exercises: IExerciseDone[],
  exerciseStatistics: IExerciseStatistics[],
  averageRestPercent?: number
) {
  if (!averageRestPercent) return '-';

  const totalDuration = exercises.reduce((acc, exercise) => {
    const averageDuration =
      exerciseStatistics.find((choosenExericse) => choosenExericse._id === exercise.exercise?._id)?.averageDuration ||
      0;

    return acc + averageDuration * exercise.repeats;
  }, 0);

  const durationWithRest = Math.round(totalDuration / (1 - averageRestPercent / 100));

  return formatDuration(durationWithRest);
}

export function convertActivityCalendarEvents(activities?: IActivity[]) {
  return activities?.map((activity: IActivity) => {
    return {
      _id: activity._id,
      start: new Date(`${activity.dateCreated}`),
      end: new Date(`${activity.dateUpdated}`),
      title: '+',
      content: activity.exercises,
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
