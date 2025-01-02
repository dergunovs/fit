import { IActivity, IExerciseDone, IExerciseStatistics } from 'fitness-tracker-contracts';
import { createTempId, formatDuration } from 'mhz-helpers';

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

export function generateExercises(exercisesDone: IExerciseDone[]): IExerciseDone[] {
  const activityExercises = exercisesDone.map((exercise) => {
    return {
      _id: createTempId(),
      exercise: {
        _id: exercise.exercise?._id || '',
        title: exercise.exercise?.title || '',
        muscleGroups: exercise.exercise?.muscleGroups || [],
      },
      repeats: exercise.repeats,
      weight: exercise.weight,
    };
  });

  return activityExercises?.length ? [...activityExercises] : [];
}
