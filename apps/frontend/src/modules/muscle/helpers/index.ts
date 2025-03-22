import { IExerciseDone, IMuscle, IMuscleStatistics } from 'fitness-tracker-contracts';

export function generateMuscleStatistics(exercises: IExerciseDone[], muscles: IMuscle[]) {
  const muscleStatistics: IMuscleStatistics[] = [];

  muscles.forEach((muscle: IMuscle) => {
    const title = muscle.title;
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
