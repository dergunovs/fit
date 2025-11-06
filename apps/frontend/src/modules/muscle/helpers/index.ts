import { IExerciseDone, IMuscle, IMuscleStatistics, TLocale } from 'fitness-tracker-contracts';
import { localeField } from 'mhz-helpers';

export function generateMuscleStatistics(exercises: IExerciseDone[], muscles: IMuscle[], locale: TLocale) {
  const muscleMap = new Map<string, { title: string; color: string; sets: number; repeats: number }>();

  for (const muscle of muscles) {
    const id = muscle._id?.toString();

    if (id) {
      muscleMap.set(id, {
        title: muscle[localeField('title', locale)] || '',
        color: muscle.color || '#000',
        sets: 0,
        repeats: 0,
      });
    }
  }

  for (const exercise of exercises) {
    if (!exercise.exercise?.muscles) continue;

    const muscleIds = new Set(exercise.exercise.muscles.map((m) => m._id?.toString()).filter(Boolean));

    for (const [muscleId, stats] of muscleMap) {
      if (muscleIds.has(muscleId)) {
        stats.sets++;
        stats.repeats += exercise.repeats || 0;
      }
    }
  }

  const muscleStatistics: IMuscleStatistics[] = [];

  for (const [, stats] of muscleMap) {
    if (stats.sets > 0) {
      muscleStatistics.push({ title: stats.title, color: stats.color, sets: stats.sets, repeats: stats.repeats });
    }
  }

  return muscleStatistics.sort((a, b) => b.repeats - a.repeats);
}
