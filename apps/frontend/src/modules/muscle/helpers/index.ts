import { IExerciseDone, IMuscle, IMuscleStatistics, TLocale } from 'fitness-tracker-contracts';
import { localeField } from 'mhz-helpers';

export function generateMuscleStatistics(exercises: IExerciseDone[], muscles: IMuscle[], locale: TLocale) {
  const muscleStatistics: IMuscleStatistics[] = [];

  muscles.forEach((muscle: IMuscle) => {
    const title = muscle[localeField('title', locale)];
    const color = muscle.color || '#000';
    let sets = 0;
    let repeats = 0;

    exercises.forEach((exercise: IExerciseDone) => {
      const setsCount =
        exercise.exercise?.muscles?.filter((muscleToFilter) => muscleToFilter._id === muscle._id).length || 0;

      sets += setsCount;

      if (exercise.exercise?.muscles?.some((groupToFilter) => groupToFilter._id === muscle._id)) {
        repeats += exercise.repeats;
      }
    });

    if (sets) muscleStatistics.push({ title, color, sets, repeats });
  });

  return muscleStatistics.sort((a, b) => b.repeats - a.repeats);
}
