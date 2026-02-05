import {
  IActivity,
  IActivityStatistics,
  IExercise,
  IExerciseStatistics,
  TActivityChartType,
  IActivityChartDataset,
  IMuscle,
  IUser,
  TLocale,
} from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import { getPercentDiff, IWeekDays } from 'mhz-helpers';
import { defaultColor, goalColor } from '../common/helpers.js';
import { IChartFilter } from '../common/types.js';
import { isUserEquipmentMatches, getUserGoals } from '../user/helpers.js';
import { ACTIVITY_POPULATE, CHART_LABELS } from './constants.js';

const CHART_PROCESSORS = {
  activity: processActivityChart,
  set: processSetsChart,
  repeat: processRepeatsChart,
  duration: processDurationChart,
  muscle: processMuscleChart,
};

interface IMuscleInfo {
  id: string;
  label: string;
  label_en: string;
  color: string;
  count: number;
}

interface IStatisticsMap {
  sets: number;
  repeats: number;
  duration: number;
}

function getActivitiesSetsRepeatsCount(activities: IActivity[]) {
  let activitiesCount = 0;
  let setsCount = 0;
  let repeatsCount = 0;

  for (const activity of activities) {
    activitiesCount++;
    setsCount += activity.exercises.length;

    for (const exercise of activity.exercises) {
      repeatsCount += exercise.repeats || 0;
    }
  }

  return { activitiesCount, setsCount, repeatsCount };
}

function getActivitiesDuration(activities: IActivity[]) {
  return activities.reduce((acc, current) => {
    const dateFrom = new Date(current.dateUpdated || 0);
    const dateTo = new Date(current.dateCreated || 0);

    const diffInSeconds = Math.floor((dateFrom.getTime() - dateTo.getTime()) / 1000);

    return acc + Math.max(diffInSeconds, 0);
  }, 0);
}

function getSetsCount(activities: IActivity[]): number {
  return activities.reduce((totalSets, activity) => totalSets + (activity.exercises?.length || 0), 0);
}

function getRepeatsCount(activities: IActivity[]): number {
  let totalRepeats = 0;

  for (const activity of activities) {
    if (activity.exercises) {
      for (const exercise of activity.exercises) {
        totalRepeats += exercise.repeats || 0;
      }
    }
  }

  return totalRepeats;
}

function getDurationInMinutes(activities: IActivity[]): number {
  const totalSeconds = getActivitiesDuration(activities);

  return Math.floor(totalSeconds / 60);
}

function getAverageRest(activities: IActivity[], duration: number) {
  if (duration <= 0) return 0;

  let exercisesDurationSum = 0;

  for (const activity of activities) {
    for (const exercise of activity.exercises) {
      exercisesDurationSum += exercise.duration || 0;
    }
  }

  return Math.max(0, Math.floor(100 - (exercisesDurationSum / duration) * 100));
}

function getAverage(count: number, activitiesCount: number) {
  return activitiesCount > 0 ? Math.floor(count / activitiesCount) : 0;
}

function getDataset(count: number, type: 'goal' | 'activity' | 'sets' | 'repeats' | 'duration', locale: TLocale) {
  const isGoal = type === 'goal';

  return {
    data: [count],
    label: CHART_LABELS[type][locale],
    borderColor: isGoal ? goalColor : defaultColor,
    backgroundColor: isGoal ? goalColor : defaultColor,
  };
}

function updateChartDataset(
  datasets: IActivityChartDataset[],
  count: number,
  goal: number,
  type: 'activity' | 'sets' | 'repeats' | 'duration',
  locale: TLocale
) {
  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(goal);
  } else {
    datasets.push(getDataset(count, type, locale), getDataset(goal, 'goal', locale));
  }
}

function processActivityChart(
  activitiesCount: number,
  activitiesGoal: number,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  updateChartDataset(datasets, activitiesCount, activitiesGoal, 'activity', locale);
}

function processSetsChart(
  activities: IActivity[],
  activitiesCount: number,
  setsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const setsCount = getSetsCount(activities);
  const count = isAverage ? getAverage(setsCount, activitiesCount) : setsCount;

  updateChartDataset(datasets, count, setsGoal, 'sets', locale);
}

function processRepeatsChart(
  activities: IActivity[],
  activitiesCount: number,
  repeatsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const repeatsCount = getRepeatsCount(activities);
  const count = isAverage ? getAverage(repeatsCount, activitiesCount) : repeatsCount;

  updateChartDataset(datasets, count, repeatsGoal, 'repeats', locale);
}

function processDurationChart(
  activities: IActivity[],
  activitiesCount: number,
  durationGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const durationInMinutes = getDurationInMinutes(activities);
  const count = isAverage ? getAverage(durationInMinutes, activitiesCount) : durationInMinutes;

  updateChartDataset(datasets, count, durationGoal, 'duration', locale);
}

async function processMuscleChart(
  Entity: Model<IActivity>,
  week: IWeekDays,
  activitiesCount: number,
  muscles: IMuscle[],
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale,
  createdBy: IUser
) {
  await getMusclesChart(
    Entity,
    { dateCreated: { $gte: week.dateFrom, $lt: week.dateTo }, isDone: true, createdBy },
    activitiesCount,
    muscles,
    isAverage,
    datasets,
    locale
  );
}

function updateMuscleCount(activities: IActivity[], muscleMap: Map<string, IMuscleInfo>) {
  for (const activity of activities) {
    if (!activity.exercises) continue;

    for (const exercise of activity.exercises) {
      if (!exercise.exercise?.muscles) continue;

      for (const muscleToFind of exercise.exercise.muscles) {
        const muscleId = `${muscleToFind._id}`;
        const muscleInfo = muscleMap.get(muscleId);

        if (muscleInfo) muscleInfo.count++;
      }
    }
  }
}

async function getMusclesChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  muscles: IMuscle[],
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const muscleMap = new Map<string, IMuscleInfo>();

  for (const muscle of muscles) {
    const id = `${muscle._id}`;

    muscleMap.set(id, {
      id,
      label: muscle.title || '',
      label_en: muscle.title_en || '',
      color: muscle.color || '#000000',
      count: 0,
    });
  }

  const activities = await Entity.find(filter).select('_id exercises dateCreated').populate(ACTIVITY_POPULATE).lean();

  updateMuscleCount(activities, muscleMap);

  const muscleData = [...muscleMap.values()].map((muscle) => {
    if (isAverage && activitiesCount > 0) {
      muscle.count = getAverage(muscle.count, activitiesCount);
    }

    return muscle;
  });

  updateDatasets(datasets, muscleData, locale);
}

function updateDatasets(datasets: IActivityChartDataset[], muscleData: IMuscleInfo[], locale: TLocale) {
  if (datasets.length > 0) {
    for (let i = 0; i < muscleData.length && i < datasets.length; i++) {
      const muscle = muscleData[i];

      datasets[i].data.push(muscle.count);

      if (locale === 'en' && datasets[0].data.length === datasets.length + 1) {
        datasets[i].label = muscle.label_en;
      }
    }
  } else {
    for (const muscle of muscleData) {
      datasets.push({
        data: [muscle.count],
        label: muscle.label,
        borderColor: muscle.color,
        backgroundColor: muscle.color,
      });
    }
  }
}

function processActivities(
  activities: IActivity[],
  statsMap: Map<string, IExerciseStatistics>,
  resultStats: Map<string, { sets: number; repeats: number; duration: number }>
) {
  for (const activity of activities) {
    if (!activity.exercises) continue;

    for (const exerciseRecord of activity.exercises) {
      const exerciseId = exerciseRecord.exercise?._id?.toString();

      if (exerciseId && statsMap.has(exerciseId)) {
        const stats = resultStats.get(exerciseId) || { sets: 0, repeats: 0, duration: 0 };

        stats.sets++;
        stats.repeats += exerciseRecord.repeats || 0;
        stats.duration += exerciseRecord.duration || 0;
        resultStats.set(exerciseId, stats);
      }
    }
  }
}

function findWeekIndex(date: Date, sortedWeeks: IWeekDays[]): number {
  let left = 0;
  let right = sortedWeeks.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const week = sortedWeeks[mid];

    if (date >= week.dateFrom && date < week.dateTo) {
      return mid;
    } else if (date < week.dateFrom) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}

export function getActivitiesStatistics(activities: IActivity[], activitiesPrev: IActivity[]) {
  const { activitiesCount, setsCount, repeatsCount } = getActivitiesSetsRepeatsCount(activities);

  const {
    activitiesCount: activitiesCountPrev,
    setsCount: setsCountPrev,
    repeatsCount: repeatsCountPrev,
  } = getActivitiesSetsRepeatsCount(activitiesPrev);

  const activitiesCountDynamics = getPercentDiff(activitiesCount, activitiesCountPrev);
  const setsCountDynamics = getPercentDiff(setsCount, setsCountPrev);
  const repeatsCountDynamics = getPercentDiff(repeatsCount, repeatsCountPrev);

  const duration = getActivitiesDuration(activities);
  const durationPrev = getActivitiesDuration(activitiesPrev);
  const durationDynamics = getPercentDiff(duration, durationPrev);

  const averageSetsPerActivity = activitiesCount ? Math.round(setsCount / activitiesCount) : 0;
  const averageSetsPerActivityPrev = activitiesCountPrev ? Math.round(setsCountPrev / activitiesCountPrev) : 0;
  const averageSetsPerActivityDynamics = getPercentDiff(averageSetsPerActivity, averageSetsPerActivityPrev);

  const averageRepeatsPerSet = setsCount ? Math.round(repeatsCount / setsCount) : 0;
  const averageRepeatsPerSetPrev = setsCountPrev ? Math.round(repeatsCountPrev / setsCountPrev) : 0;
  const averageRepeatsPerSetDynamics = getPercentDiff(averageRepeatsPerSet, averageRepeatsPerSetPrev);

  const averageDuration = activitiesCount ? Math.round(duration / activitiesCount) : 0;
  const averageDurationPrev = activitiesCountPrev ? Math.round(durationPrev / activitiesCountPrev) : 0;
  const averageDurationDynamics = getPercentDiff(averageDuration, averageDurationPrev);

  const averageRestPercent = duration ? getAverageRest(activities, duration) : 0;
  const averageRestPercentPrev = durationPrev ? getAverageRest(activitiesPrev, durationPrev) : 0;
  const averageRestPercentDynamics = getPercentDiff(averageRestPercent, averageRestPercentPrev);

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

export function getExercisesStatistics(
  activities: IActivity[],
  activitiesPrev: IActivity[],
  exercises: IExercise[],
  user: IUser
) {
  const exerciseMap = new Map<string, IExercise>();

  for (const exercise of exercises) {
    if (exercise._id) {
      exerciseMap.set(exercise._id.toString(), exercise);
    }
  }

  const statsMap = new Map<string, IExerciseStatistics>();

  for (const [id, exercise] of exerciseMap) {
    statsMap.set(id, {
      exercise,
      sets: 0,
      setsDynamics: 0,
      repeats: 0,
      repeatsDynamics: 0,
      averageDuration: 0,
      isUserEquipmentMatches: isUserEquipmentMatches(exercise, user),
    });
  }

  const currentStats = new Map<string, IStatisticsMap>();
  const prevStats = new Map<string, IStatisticsMap>();

  processActivities(activities, statsMap, currentStats);
  processActivities(activitiesPrev, statsMap, prevStats);

  for (const [id, stats] of statsMap) {
    const curr = currentStats.get(id) || { sets: 0, repeats: 0, duration: 0 };
    const prev = prevStats.get(id) || { sets: 0, repeats: 0, duration: 0 };

    stats.sets = curr.sets;
    stats.repeats = curr.repeats;
    stats.setsDynamics = getPercentDiff(curr.sets, prev.sets);
    stats.repeatsDynamics = getPercentDiff(curr.repeats, prev.repeats);
    stats.averageDuration = curr.repeats > 0 ? curr.duration / curr.repeats : 0;
  }

  return [...statsMap.values()].sort((a, b) => b.sets - a.sets);
}

export async function getActivitiesChartData(
  Entity: Model<IActivity>,
  weeks: IWeekDays[],
  type: TActivityChartType,
  locale: TLocale,
  user: IUser,
  muscles: IMuscle[],
  isMonth: boolean,
  isAverage: boolean
) {
  const labels: string[] = [];
  const datasets: IActivityChartDataset[] = [];

  const { activitiesGoal, setsGoal, repeatsGoal, durationGoal } = getUserGoals(isMonth, isAverage, user);

  const minDate = weeks[0].dateFrom;
  const maxDate = weeks.at(-1)?.dateTo;

  const allActivities = await Entity.find({
    dateCreated: { $gte: minDate, $lt: maxDate },
    isDone: true,
    createdBy: user,
  }).lean();

  const weekActivitiesMap = new Map<number, IActivity[]>();

  for (const activity of allActivities) {
    const weekIndex = findWeekIndex(activity.dateCreated as Date, weeks);

    if (weekIndex !== -1) {
      if (!weekActivitiesMap.has(weekIndex)) weekActivitiesMap.set(weekIndex, []);

      weekActivitiesMap.get(weekIndex)?.push(activity);
    }
  }

  const weekDataArray = weeks.map((week, index) => {
    labels.push(week.label);
    const activities = weekActivitiesMap.get(index) || [];
    const activitiesCount = activities.length;

    return { week, activities, activitiesCount };
  });

  switch (type) {
    case 'activity': {
      for (const { activitiesCount } of weekDataArray) {
        CHART_PROCESSORS.activity(activitiesCount, activitiesGoal, datasets, locale);
      }
      break;
    }

    case 'set': {
      for (const { activities, activitiesCount } of weekDataArray) {
        CHART_PROCESSORS.set(activities, activitiesCount, setsGoal, isAverage, datasets, locale);
      }
      break;
    }

    case 'repeat': {
      for (const { activities, activitiesCount } of weekDataArray) {
        CHART_PROCESSORS.repeat(activities, activitiesCount, repeatsGoal, isAverage, datasets, locale);
      }
      break;
    }

    case 'duration': {
      for (const { activities, activitiesCount } of weekDataArray) {
        CHART_PROCESSORS.duration(activities, activitiesCount, durationGoal, isAverage, datasets, locale);
      }
      break;
    }

    case 'muscle': {
      for (const { week, activitiesCount } of weekDataArray) {
        await CHART_PROCESSORS.muscle(Entity, week, activitiesCount, muscles, isAverage, datasets, locale, user);
      }
      break;
    }
  }

  return { labels, datasets };
}
