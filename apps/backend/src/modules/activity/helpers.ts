import {
  IActivity,
  IActivityStatistics,
  IExercise,
  IExerciseStatistics,
  TActivityChartType,
} from 'fitness-tracker-contracts';
import { Model } from 'mongoose';

import { IWeekDays } from '../common/types.js';
import { getDynamics } from '../common/helpers.js';

function activitiesGetCount(activities: IActivity[]) {
  const activitiesCount = activities.length;
  const setsCount = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);
  const repeatsCount = activities.reduce(
    (acc, current) => acc + current.exercises.reduce((accEx, currentEx) => accEx + (currentEx.repeats || 0), 0),
    0
  );

  return { activitiesCount, setsCount, repeatsCount };
}

function activitiesGetAverageDuration(activities: IActivity[]) {
  return activities.reduce((acc, current) => {
    const dateFrom = new Date(current.dateUpdated || 0);
    const dateTo = new Date(current.dateCreated || 0);

    const diff = Math.floor(((dateFrom as unknown as number) - (dateTo as unknown as number)) / 1000);

    return acc + diff || 0;
  }, 0);
}

function activitiesGetAverageRest(activities: IActivity[], duration: number) {
  const exercisesDurationSumm = activities.reduce((acc, currentActivity) => {
    const exercisesDuration = currentActivity.exercises.reduce(
      (accEx, currentEx) => accEx + (currentEx.duration || 0),
      0
    );

    return acc + exercisesDuration || 0;
  }, 0);

  return Math.floor(100 - (exercisesDurationSumm / duration) * 100);
}

export function activitiesGetStatistics(activities: IActivity[], activitiesPrev: IActivity[]) {
  const { activitiesCount, setsCount, repeatsCount } = activitiesGetCount(activities);
  const {
    activitiesCount: activitiesCountPrev,
    setsCount: setsCountPrev,
    repeatsCount: repeatsCountPrev,
  } = activitiesGetCount(activitiesPrev);
  const activitiesCountDynamics = getDynamics(activitiesCount, activitiesCountPrev);
  const setsCountDynamics = getDynamics(setsCount, setsCountPrev);
  const repeatsCountDynamics = getDynamics(repeatsCount, repeatsCountPrev);

  const duration = activitiesGetAverageDuration(activities);
  const durationPrev = activitiesGetAverageDuration(activitiesPrev);
  const durationDynamics = getDynamics(duration, durationPrev);

  const averageSetsPerActivity = Math.round(setsCount / activitiesCount);
  const averageSetsPerActivityPrev = Math.round(setsCountPrev / activitiesCountPrev);
  const averageSetsPerActivityDynamics = getDynamics(averageSetsPerActivity, averageSetsPerActivityPrev);

  const averageRepeatsPerSet = Math.round(repeatsCount / setsCount);
  const averageRepeatsPerSetPrev = Math.round(repeatsCountPrev / setsCountPrev);
  const averageRepeatsPerSetDynamics = getDynamics(averageRepeatsPerSet, averageRepeatsPerSetPrev);

  const averageDuration = Math.round(duration / activitiesCount);
  const averageDurationPrev = Math.round(durationPrev / activitiesCountPrev);
  const averageDurationDynamics = getDynamics(averageDuration, averageDurationPrev);

  const averageRestPercent = activitiesGetAverageRest(activities, duration);
  const averageRestPercentPrev = activitiesGetAverageRest(activitiesPrev, durationPrev);
  const averageRestPercentDynamics = getDynamics(averageRestPercent, averageRestPercentPrev);

  const activityStatistics: IActivityStatistics = {
    activitiesCount: { cur: activitiesCount, dynamics: activitiesCountDynamics },
    setsCount: { cur: setsCount, dynamics: setsCountDynamics },
    repeatsCount: { cur: repeatsCount, dynamics: repeatsCountDynamics },
    duration: { cur: duration, dynamics: durationDynamics },
    averageSetsPerActivity: { cur: averageSetsPerActivity, dynamics: averageSetsPerActivityDynamics },
    averageRepeatsPerSet: { cur: averageRepeatsPerSet, dynamics: averageRepeatsPerSetDynamics },
    averageDuration: { cur: averageDuration, dynamics: averageDurationDynamics },
    averageRestPercent: { cur: averageRestPercent, dynamics: averageRestPercentDynamics },
  };

  return activityStatistics;
}

export function exerciseGetStatistics(activities: IActivity[], exercises: IExercise[]) {
  const exerciseStatistics: IExerciseStatistics[] = [];

  exercises.forEach((exercise) => {
    const exerciseStatisticsElement: IExerciseStatistics = {
      _id: exercise._id || '',
      title: exercise.title,
      sets: 0,
      repeats: 0,
      averageDuration: 0,
    };

    activities.forEach((activity: IActivity) => {
      const filteredExercises = activity.exercises.filter(
        (exerciseToFilter) => exerciseToFilter.exercise?.toString() === exercise._id?.toString()
      );

      exerciseStatisticsElement.sets += filteredExercises.length;

      exerciseStatisticsElement.repeats += filteredExercises.reduce((acc, current) => acc + (current.repeats || 0), 0);

      exerciseStatisticsElement.averageDuration += filteredExercises.reduce(
        (acc, current) => acc + (current.duration || 0),
        0
      );
    });

    exerciseStatisticsElement.averageDuration =
      exerciseStatisticsElement.averageDuration / exerciseStatisticsElement.repeats || 0;

    exerciseStatistics.push(exerciseStatisticsElement);
  });

  return exerciseStatistics.sort((a, b) => b.sets - a.sets);
}

export async function activitiesGetChartData(Entity: Model<IActivity>, weeks: IWeekDays[], type: TActivityChartType) {
  const labels: string[] = [];
  const data: number[] = [];

  for (const week of weeks) {
    labels.push(week.label);

    if (type === 'activity') {
      const count = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
        .countDocuments()
        .exec();

      data.push(count);
    }

    if (type === 'set') {
      const activities = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
        .select('_id exercises dateCreated')
        .populate({ path: 'exercises' })
        .lean()
        .exec();

      const count = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);

      data.push(count);
    }

    if (type === 'repeat') {
      const activities = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
        .select('_id exercises dateCreated')
        .populate({ path: 'exercises.exercise', select: ['title'] })
        .lean()
        .exec();

      const count = activities.reduce((acc, activity) => {
        const repeats = activity.exercises.reduce((accEx, curEx) => accEx + (curEx.repeats || 0), 0);

        return acc + repeats;
      }, 0);

      data.push(count);
    }
  }

  return { labels, data };
}
