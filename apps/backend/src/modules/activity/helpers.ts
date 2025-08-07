import {
  IActivity,
  IActivityStatistics,
  IExercise,
  IExerciseStatistics,
  TActivityChartType,
  IActivityChartDataset,
  IMuscle,
  IUser,
  GOALS,
  TDecode,
  TLocale,
} from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import { getPercentDiff, IWeekDays } from 'mhz-helpers';
import { defaultColor, goalColor, getGoals } from '../common/helpers.js';
import { IChartFilter } from '../common/types.js';
import { decodeToken } from '../auth/helpers.js';
import { ACTIVITY_POPULATE } from './constants.js';

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

    const diff = Math.floor((dateFrom.getTime() - dateTo.getTime()) / 1000);

    return acc + (diff > 0 ? diff : 0);
  }, 0);
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

function getUserEquipmentParams(exercise: IExercise, user?: IUser | null) {
  const isExerciseHasEquipment = !!exercise.equipment;
  const isExerciseHasEquipmentForWeight = !!exercise.equipmentForWeight?.length;
  const isWeightsRequired = !!exercise.isWeightsRequired;

  if (!user?.equipments?.length) {
    return {
      isExerciseHasEquipment,
      isExerciseHasEquipmentForWeight,
      isWeightsRequired,
      isUserHasEquipment: false,
      isUserHasEquipmentForWeight: false,
    };
  }

  const isUserHasEquipment = user.equipments.some(
    (equipment) => equipment.equipment?._id?.toString() === exercise.equipment?._id?.toString()
  );

  const isUserHasEquipmentForWeight = user.equipments.some((equipment) =>
    exercise.equipmentForWeight?.some(
      (equipmentForWeight) => equipmentForWeight._id?.toString() === equipment.equipment?._id?.toString()
    )
  );

  return {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  };
}

function isUserEquipmentMatches(exercise: IExercise, user?: IUser | null) {
  const {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  } = getUserEquipmentParams(exercise, user);

  if (!isExerciseHasEquipment && !isExerciseHasEquipmentForWeight) return true;
  if (isUserHasEquipment && !isWeightsRequired) return true;
  if (!isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipmentForWeight) return true;
  if (!isExerciseHasEquipment && !isWeightsRequired) return true;
  if (isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipment && isUserHasEquipmentForWeight)
    return true;

  return false;
}

function getAverage(count: number, activitiesCount: number) {
  return activitiesCount > 0 ? Math.floor(count / activitiesCount) : 0;
}

const LABELS = {
  goal: { ru: 'Цель', en: 'Goal' },
  activity: { ru: 'Занятия', en: 'Activities' },
  sets: { ru: 'Подходы', en: 'Sets' },
  repeats: { ru: 'Повторы', en: 'Repeats' },
  duration: { ru: 'Длительность', en: 'Duration' },
};

function getDataset(count: number, type: 'goal' | 'activity' | 'sets' | 'repeats' | 'duration', locale: TLocale) {
  const isGoal = type === 'goal';

  return {
    data: [count],
    label: LABELS[type][locale],
    borderColor: isGoal ? goalColor : defaultColor,
    backgroundColor: isGoal ? goalColor : defaultColor,
  };
}

function getActivitiesChart(
  activitiesCount: number,
  activitiesGoal: number,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const count = activitiesCount;

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(activitiesGoal);
  } else {
    datasets.push(getDataset(count, 'activity', locale), getDataset(activitiesGoal, 'goal', locale));
  }
}

async function getSetsChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  setsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const activities = await Entity.find(filter).select('_id exercises dateCreated').populate(ACTIVITY_POPULATE).lean();

  let count = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(setsGoal);
  } else {
    datasets.push(getDataset(count, 'sets', locale), getDataset(setsGoal, 'goal', locale));
  }
}

async function getRepeatsChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  repeatsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const activities = await Entity.find(filter).select('_id exercises dateCreated').populate(ACTIVITY_POPULATE).lean();

  let count = activities.reduce((acc, activity) => {
    const repeats = activity.exercises.reduce((accEx, curEx) => accEx + (curEx.repeats || 0), 0);

    return acc + repeats;
  }, 0);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(repeatsGoal);
  } else {
    datasets.push(getDataset(count, 'repeats', locale), getDataset(repeatsGoal, 'goal', locale));
  }
}

async function getDurationChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  durationGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: TLocale
) {
  const activities = await Entity.find(filter).select('_id dateUpdated dateCreated').lean();

  let count = Math.floor(activitiesGetTotalDuration(activities) / 60);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length >= 2) {
    datasets[0].data.push(count);
    datasets[1].data.push(durationGoal);
  } else {
    datasets.push(getDataset(count, 'duration', locale), getDataset(durationGoal, 'goal', locale));
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

  if (datasets.length) {
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

export function adminOrUserFilter(decode?: TDecode, token?: string) {
  const decodedUser = decodeToken(decode, token);

  return decodedUser ? { email: decodedUser.email } : { role: 'admin' };
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
  user: IUser | null
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

    const isEquipmentMatches = !user || isUserEquipmentMatches(exercise, user);

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
  user: IUser | null,
  muscles: IMuscle[],
  isMonth: boolean,
  isAverage: boolean
) {
  const labels: string[] = [];
  const datasets: IActivityChartDataset[] = [];

  const { activitiesGoal, setsGoal, repeatsGoal, durationGoal } = getGoals(isMonth, isAverage, GOALS);

  for (const week of weeks) {
    const filter = { dateCreated: { $gte: week.dateFrom, $lt: week.dateTo }, isDone: true, createdBy: user?._id };
    const count = await Entity.countDocuments(filter);

    labels.push(week.label);

    if (type === 'activity') getActivitiesChart(count, activitiesGoal, datasets, locale);
    if (type === 'set') await getSetsChart(Entity, filter, count, setsGoal, isAverage, datasets, locale);
    if (type === 'repeat') await getRepeatsChart(Entity, filter, count, repeatsGoal, isAverage, datasets, locale);
    if (type === 'duration') await getDurationChart(Entity, filter, count, durationGoal, isAverage, datasets, locale);
    if (type === 'muscle') await getMusclesChart(Entity, filter, count, muscles, isAverage, datasets, locale);
  }

  return { labels, datasets };
}
