import {
  IActivity,
  IActivityStatistics,
  IExercise,
  IExerciseStatistics,
  TActivityChartType,
  IMuscleGroup,
  EXERCISE_MUSCLE_GROUPS,
  IActivityChartDataset,
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

export function exerciseGetStatistics(activities: IActivity[], activitiesPrev: IActivity[], exercises: IExercise[]) {
  const exerciseStatistics: IExerciseStatistics[] = [];

  exercises.forEach((exercise) => {
    const exerciseStatisticsElement: IExerciseStatistics = {
      _id: exercise._id || '',
      title: exercise.title,
      sets: 0,
      setsDynamics: 0,
      repeats: 0,
      repeatsDynamics: 0,
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

    activitiesPrev.forEach((activity: IActivity) => {
      const filteredExercises = activity.exercises.filter(
        (exerciseToFilter) => exerciseToFilter.exercise?.toString() === exercise._id?.toString()
      );

      exerciseStatisticsElement.setsDynamics += filteredExercises.length;

      exerciseStatisticsElement.repeatsDynamics += filteredExercises.reduce(
        (acc, current) => acc + (current.repeats || 0),
        0
      );
    });

    exerciseStatisticsElement.setsDynamics = getDynamics(
      exerciseStatisticsElement.sets,
      exerciseStatisticsElement.setsDynamics
    );

    exerciseStatisticsElement.repeatsDynamics = getDynamics(
      exerciseStatisticsElement.repeats,
      exerciseStatisticsElement.repeatsDynamics
    );

    exerciseStatisticsElement.averageDuration =
      exerciseStatisticsElement.averageDuration / exerciseStatisticsElement.repeats || 0;

    exerciseStatistics.push(exerciseStatisticsElement);
  });

  return exerciseStatistics.sort((a, b) => b.sets - a.sets);
}

export async function activitiesGetChartData(Entity: Model<IActivity>, weeks: IWeekDays[], type: TActivityChartType) {
  const labels: string[] = [];
  const datasets: IActivityChartDataset[] = [];

  for (const week of weeks) {
    labels.push(week.label);

    if (type === 'activity') {
      const count = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
        .countDocuments()
        .exec();

      if (datasets.length) {
        datasets[0].data.push(count);
      } else {
        datasets.push({ data: [count], label: 'Занятия' });
      }
    }

    if (type === 'set') {
      const activities = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
        .select('_id exercises dateCreated')
        .populate({ path: 'exercises' })
        .lean()
        .exec();

      const count = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);

      if (datasets.length) {
        datasets[0].data.push(count);
      } else {
        datasets.push({ data: [count], label: 'Подходы' });
      }
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

      if (datasets.length) {
        datasets[0].data.push(count);
      } else {
        datasets.push({ data: [count], label: 'Повторы' });
      }
    }

    if (type === 'group') {
      const groupCount = (EXERCISE_MUSCLE_GROUPS as IMuscleGroup[]).map((group) => {
        return {
          label: group.title,
          count: 0,
        };
      });

      for (const [index, muscleGroup] of groupCount.entries()) {
        const activities = await Entity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
          .select('_id exercises dateCreated')
          .populate({ path: 'exercises.exercise' })
          .lean()
          .exec();

        const count = activities.reduce((acc, current) => {
          let sets = 0;

          current.exercises.forEach((e) => {
            if (e.exercise?.muscleGroups?.some((group) => group.title === muscleGroup.label)) ++sets;
          });

          return acc + (sets || 0);
        }, 0);

        groupCount[index].count = count;
      }

      if (datasets.length) {
        groupCount.forEach((group) => {
          datasets.forEach((set) => {
            if (set.label === group.label) set.data.push(group.count);
          });
        });
      } else {
        groupCount.forEach((group) => {
          datasets.push({ data: [group.count], label: group.label });
        });
      }
    }
  }

  return { labels, datasets };
}
