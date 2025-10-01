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

function activitiesGetCount(activities: IActivity[]) {
  const activitiesCount = activities.length;
  const setsCount = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);
  const repeatsCount = activities.reduce(
    (acc, current) => acc + current.exercises.reduce((accEx, currentEx) => accEx + (currentEx.repeats || 0), 0),
    0
  );

  return { activitiesCount, setsCount, repeatsCount };
}

function activitiesGetTotalDuration(activities: IActivity[]) {
  return activities.reduce((acc, current) => {
    const dateFrom = new Date(current.dateUpdated || 0);
    const dateTo = new Date(current.dateCreated || 0);

    const diffInSeconds = Math.floor((dateFrom.getTime() - dateTo.getTime()) / 1000);

    return acc + Math.max(diffInSeconds, 0);
  }, 0);
}

function calculateSetsCount(activities: IActivity[]): number {
  return activities.reduce((totalSets, activity) => totalSets + (activity.exercises?.length || 0), 0);
}

function calculateRepeatsCount(activities: IActivity[]): number {
  return activities.reduce((totalRepeats, activity) => {
    return (
      totalRepeats +
      (activity.exercises?.reduce((exerciseRepeats, exercise) => exerciseRepeats + (exercise.repeats || 0), 0) || 0)
    );
  }, 0);
}

function calculateDurationInMinutes(activities: IActivity[]): number {
  const totalSeconds = activitiesGetTotalDuration(activities);

  return Math.floor(totalSeconds / 60);
}

function activitiesGetAverageRest(activities: IActivity[], duration: number) {
  if (duration <= 0) return 0;

  const exercisesDurationSum = activities.reduce((acc, currentActivity) => {
    const exercisesDuration = currentActivity.exercises.reduce(
      (accEx, currentEx) => accEx + (currentEx.duration || 0),
      0
    );

    return acc + exercisesDuration || 0;
  }, 0);

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

function processActivityChart(
  activitiesCount: number,
  activitiesGoal: number,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  if (datasets.length >= 2) {
    datasets[0].data.push(activitiesCount);
    datasets[1].data.push(activitiesGoal);
  } else {
    datasets.push(getDataset(activitiesCount, 'activity', locale), getDataset(activitiesGoal, 'goal', locale));
  }
}

function processSetsChart(
  activities: IActivity[],
  activitiesCount: number,
  setsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const setsCount = calculateSetsCount(activities);
  const count = isAverage ? getAverage(setsCount, activitiesCount) : setsCount;

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(setsGoal);
  } else {
    datasets.push(getDataset(count, 'sets', locale), getDataset(setsGoal, 'goal', locale));
  }
}

function processRepeatsChart(
  activities: IActivity[],
  activitiesCount: number,
  repeatsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const repeatsCount = calculateRepeatsCount(activities);
  const count = isAverage ? getAverage(repeatsCount, activitiesCount) : repeatsCount;

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(repeatsGoal);
  } else {
    datasets.push(getDataset(count, 'repeats', locale), getDataset(repeatsGoal, 'goal', locale));
  }
}

function processDurationChart(
  activities: IActivity[],
  activitiesCount: number,
  durationGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const durationInMinutes = calculateDurationInMinutes(activities);
  const count = isAverage ? getAverage(durationInMinutes, activitiesCount) : durationInMinutes;

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(durationGoal);
  } else {
    datasets.push(getDataset(count, 'duration', locale), getDataset(durationGoal, 'goal', locale));
  }
}

async function processMuscleChart(
  Entity: Model<IActivity>,
  week: IWeekDays,
  activitiesCount: number,
  muscles: IMuscle[],
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale,
  userId: string
) {
  await getMusclesChart(
    Entity,
    {
      dateCreated: { $gte: week.dateFrom, $lt: week.dateTo },
      isDone: true,
      createdBy: userId,
    },
    activitiesCount,
    muscles,
    isAverage,
    datasets,
    locale
  );
}

const CHART_PROCESSORS = {
  activity: processActivityChart,
  set: processSetsChart,
  repeat: processRepeatsChart,
  duration: processDurationChart,
  muscle: processMuscleChart,
};

async function getMusclesChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  muscles: IMuscle[],
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const muscleData = muscles.map((muscle) => ({
    id: muscle._id?.toString(),
    label: muscle.title,
    label_en: muscle.title_en,
    color: muscle.color,
    count: 0,
  }));

  const activities = await Entity.find(filter).select('_id exercises dateCreated').populate(ACTIVITY_POPULATE).lean();

  for (const [index, muscle] of muscleData.entries()) {
    let count = activities.reduce((acc, current) => {
      let sets = 0;

      current.exercises.forEach((e) => {
        if (e.exercise?.muscles?.some((muscleToFind) => muscleToFind.title === muscle.label)) ++sets;
      });

      return acc + (sets || 0);
    }, 0);

    if (isAverage) count = getAverage(count, activitiesCount);

    muscleData[index].count = count;
  }

  const chartDatasets: IActivityChartDataset[] = [];

  for (const muscle of muscleData) {
    chartDatasets.push({
      data: [muscle.count],
      label: muscle.label,
      borderColor: muscle.color,
      backgroundColor: muscle.color,
    });
  }

  if (datasets.length > 0) {
    datasets.forEach((set, index) => {
      if (index < chartDatasets.length) {
        set.data.push(chartDatasets[index].data[0]);
        if (locale === 'en' && datasets[0].data.length === datasets.length + 1) set.label = muscleData[index]?.label_en;
      }
    });
  } else {
    for (const dataset of chartDatasets) {
      datasets.push(dataset);
    }
  }
}

export function activitiesGetStatistics(activities: IActivity[], activitiesPrev: IActivity[]) {
  const { activitiesCount, setsCount, repeatsCount } = activitiesGetCount(activities);
  const {
    activitiesCount: activitiesCountPrev,
    setsCount: setsCountPrev,
    repeatsCount: repeatsCountPrev,
  } = activitiesGetCount(activitiesPrev);
  const activitiesCountDynamics = getPercentDiff(activitiesCount, activitiesCountPrev);
  const setsCountDynamics = getPercentDiff(setsCount, setsCountPrev);
  const repeatsCountDynamics = getPercentDiff(repeatsCount, repeatsCountPrev);

  const duration = activitiesGetTotalDuration(activities);
  const durationPrev = activitiesGetTotalDuration(activitiesPrev);
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

  const averageRestPercent = duration ? activitiesGetAverageRest(activities, duration) : 0;
  const averageRestPercentPrev = durationPrev ? activitiesGetAverageRest(activitiesPrev, durationPrev) : 0;
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

export function exerciseGetStatistics(
  activities: IActivity[],
  activitiesPrev: IActivity[],
  exercises: IExercise[],
  user: IUser
) {
  const exerciseStatistics: IExerciseStatistics[] = [];

  exercises.forEach((exercise) => {
    const exerciseStats: IExerciseStatistics = {
      exercise,
      sets: 0,
      setsDynamics: 0,
      repeats: 0,
      repeatsDynamics: 0,
      averageDuration: 0,
      isUserEquipmentMatches: false,
    };

    const isEquipmentMatches = isUserEquipmentMatches(exercise, user);

    if (isEquipmentMatches) exerciseStats.isUserEquipmentMatches = true;

    let totalDuration = 0;

    activities.forEach((activity: IActivity) => {
      const filteredExercises = activity.exercises.filter(
        (exerciseToFilter) => exerciseToFilter.exercise?._id?.toString() === exercise._id?.toString()
      );

      exerciseStats.sets += filteredExercises.length;
      exerciseStats.repeats += filteredExercises.reduce((acc, current) => acc + (current.repeats || 0), 0);
      totalDuration += filteredExercises.reduce((acc, current) => acc + (current.duration || 0), 0);
    });

    let prevSets = 0;
    let prevRepeats = 0;

    activitiesPrev.forEach((activity: IActivity) => {
      const filteredExercises = activity.exercises.filter(
        (exerciseToFilter) => exerciseToFilter.exercise?._id?.toString() === exercise._id?.toString()
      );

      prevSets += filteredExercises.length;
      prevRepeats += filteredExercises.reduce((acc, current) => acc + (current.repeats || 0), 0);
    });

    exerciseStats.setsDynamics = getPercentDiff(exerciseStats.sets, prevSets);
    exerciseStats.repeatsDynamics = getPercentDiff(exerciseStats.repeats, prevRepeats);

    exerciseStats.averageDuration = exerciseStats.repeats > 0 ? totalDuration / exerciseStats.repeats : 0;

    exerciseStatistics.push(exerciseStats);
  });

  return exerciseStatistics.sort((a, b) => b.sets - a.sets);
}

export async function activitiesGetChartData(
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

  const weekPromises = weeks.map(async (week) => {
    const filter = {
      dateCreated: { $gte: week.dateFrom, $lt: week.dateTo },
      isDone: true,
      createdBy: user._id,
    };

    const activities = await Entity.find(filter).lean();
    const activitiesCount = activities.length;

    return { week, activities, activitiesCount };
  });

  const weekDataArray = await Promise.all(weekPromises);

  for (const { week, activities, activitiesCount } of weekDataArray) {
    labels.push(week.label);

    switch (type) {
      case 'activity': {
        CHART_PROCESSORS.activity(activitiesCount, activitiesGoal, datasets, locale);
        break;
      }
      case 'set': {
        CHART_PROCESSORS.set(activities, activitiesCount, setsGoal, isAverage, datasets, locale);
        break;
      }
      case 'repeat': {
        CHART_PROCESSORS.repeat(activities, activitiesCount, repeatsGoal, isAverage, datasets, locale);
        break;
      }
      case 'duration': {
        CHART_PROCESSORS.duration(activities, activitiesCount, durationGoal, isAverage, datasets, locale);
        break;
      }
      case 'muscle': {
        await CHART_PROCESSORS.muscle(
          Entity,
          week,
          activitiesCount,
          muscles,
          isAverage,
          datasets,
          locale,
          user._id || ''
        );
        break;
      }
    }
  }

  return { labels, datasets };
}
