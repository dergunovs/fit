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
} from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import { getPercentDiff, IWeekDays } from 'mhz-helpers';
import { defaultColor, goalColor, getGoals } from '../common/helpers.js';
import { IChartFilter } from '../common/types.js';

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

function getUserEquipmentParams(exercise: IExercise, user?: IUser | null) {
  const isExerciseHasEquipment = !!exercise.equipment;
  const isExerciseHasEquipmentForWeight = !!exercise.equipmentForWeight?.length;
  const isWeightsRequired = !!exercise.isWeightsRequired;

  const isUserHasEquipment = !!user?.equipments?.some(
    (equipment) => equipment.equipment?._id?.toString() === exercise.equipment?._id?.toString()
  );

  const isUserHasEquipmentForWeight = !!user?.equipments?.some((equipment) =>
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
  let result = false;

  const {
    isExerciseHasEquipment,
    isExerciseHasEquipmentForWeight,
    isWeightsRequired,
    isUserHasEquipment,
    isUserHasEquipmentForWeight,
  } = getUserEquipmentParams(exercise, user);

  if (!isExerciseHasEquipment && !isExerciseHasEquipmentForWeight) {
    result = true;
  } else if (isUserHasEquipment && !isWeightsRequired) {
    result = true;
  } else if (!isExerciseHasEquipment && isExerciseHasEquipmentForWeight && isUserHasEquipmentForWeight) {
    result = true;
  } else if (!isExerciseHasEquipment && !isWeightsRequired) {
    result = true;
  } else if (
    isExerciseHasEquipment &&
    isExerciseHasEquipmentForWeight &&
    isUserHasEquipment &&
    isUserHasEquipmentForWeight
  ) {
    result = true;
  }

  return result;
}

function getAverage(count: number, activitiesCount: number) {
  return Math.floor(count / activitiesCount) || 0;
}

function generateActivitiesChart(
  activitiesCount: number,
  activitiesGoal: number,
  datasets: IActivityChartDataset[],
  locale: string
) {
  const count = activitiesCount;

  if (datasets.length) {
    datasets[0].data.push(count);
    datasets[1].data.push(activitiesGoal);
  } else {
    datasets.push(
      {
        data: [count],
        label: locale === 'ru' ? 'Занятия' : 'Activities',
        borderColor: defaultColor,
        backgroundColor: defaultColor,
      },
      {
        data: [activitiesGoal],
        label: locale === 'ru' ? 'Цель' : 'Goal',
        borderColor: goalColor,
        backgroundColor: goalColor,
      }
    );
  }
}

async function generateSetsChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  setsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: string
) {
  const activities = await Entity.find(filter)
    .select('_id exercises dateCreated')
    .populate({ path: 'exercises' })
    .lean()
    .exec();

  let count = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length) {
    datasets[0].data.push(count);
    datasets[1].data.push(setsGoal);
  } else {
    datasets.push(
      {
        data: [count],
        label: locale === 'ru' ? 'Подходы' : 'Sets',
        borderColor: defaultColor,
        backgroundColor: defaultColor,
      },
      {
        data: [setsGoal],
        label: locale === 'ru' ? 'Цель' : 'Goal',
        borderColor: goalColor,
        backgroundColor: goalColor,
      }
    );
  }
}

async function generateRepeatsChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  repeatsGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: string
) {
  const activities = await Entity.find(filter)
    .select('_id exercises dateCreated')
    .populate({ path: 'exercises.exercise', select: ['title'] })
    .lean()
    .exec();

  let count = activities.reduce((acc, activity) => {
    const repeats = activity.exercises.reduce((accEx, curEx) => accEx + (curEx.repeats || 0), 0);

    return acc + repeats;
  }, 0);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length) {
    datasets[0].data.push(count);
    datasets[1].data.push(repeatsGoal);
  } else {
    datasets.push(
      {
        data: [count],
        label: locale === 'ru' ? 'Повторы' : 'Repeats',
        borderColor: defaultColor,
        backgroundColor: defaultColor,
      },
      {
        data: [repeatsGoal],
        label: locale === 'ru' ? 'Цель' : 'Goal',
        borderColor: goalColor,
        backgroundColor: goalColor,
      }
    );
  }
}

async function generateDurationChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  durationGoal: number,
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: string
) {
  const activities = await Entity.find(filter).select('_id dateUpdated dateCreated').lean().exec();

  let count = Math.floor(activitiesGetTotalDuration(activities) / 60);

  if (isAverage) count = getAverage(count, activitiesCount);

  if (datasets.length) {
    datasets[0].data.push(count);
    datasets[1].data.push(durationGoal);
  } else {
    datasets.push(
      {
        data: [count],
        label: locale === 'ru' ? 'Длительность' : 'Duration',
        borderColor: defaultColor,
        backgroundColor: defaultColor,
      },
      {
        data: [durationGoal],
        label: locale === 'ru' ? 'Цель' : 'Goal',
        borderColor: goalColor,
        backgroundColor: goalColor,
      }
    );
  }
}

async function generateMusclesChart(
  Entity: Model<IActivity>,
  filter: IChartFilter,
  activitiesCount: number,
  muscles: IMuscle[],
  isAverage: boolean,
  datasets: IActivityChartDataset[],
  locale: string
) {
  const muscleCount = muscles.map((muscle) => {
    return {
      label: muscle.title,
      label_en: muscle.title_en,
      count: 0,
      borderColor: muscle.color,
      backgroundColor: muscle.color,
    };
  });

  for (const [index, muscle] of muscleCount.entries()) {
    const activities = await Entity.find(filter)
      .select('_id exercises dateCreated')
      .populate({ path: 'exercises.exercise', populate: 'muscles' })
      .lean()
      .exec();

    let count = activities.reduce((acc, current) => {
      let sets = 0;

      current.exercises.forEach((e) => {
        if (e.exercise?.muscles?.some((muscleToFind) => muscleToFind.title === muscle.label)) ++sets;
      });

      return acc + (sets || 0);
    }, 0);

    if (isAverage) count = getAverage(count, activitiesCount);

    muscleCount[index].count = count;
  }

  if (datasets.length) {
    muscleCount.forEach((muscle) => {
      datasets.forEach((set) => {
        if (set.label === muscle.label) {
          set.data.push(muscle.count);
          if (locale !== 'ru' && datasets[0].data.length === datasets.length + 1) set.label = muscle.label_en;
        }
      });
    });
  } else {
    muscleCount.forEach((muscle) => {
      datasets.push({
        data: [muscle.count],
        label: muscle.label,
        borderColor: muscle.borderColor,
        backgroundColor: muscle.backgroundColor,
      });
    });
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
  user: IUser | null
) {
  const exerciseStatistics: IExerciseStatistics[] = [];

  exercises.forEach((exercise) => {
    const exerciseStatisticsElement: IExerciseStatistics = {
      exercise,
      sets: 0,
      setsDynamics: 0,
      repeats: 0,
      repeatsDynamics: 0,
      averageDuration: 0,
      isUserEquipmentMatches: false,
    };

    const isEquipmentMatches = !user || isUserEquipmentMatches(exercise, user);

    if (isEquipmentMatches) exerciseStatisticsElement.isUserEquipmentMatches = true;

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

    exerciseStatisticsElement.setsDynamics = getPercentDiff(
      exerciseStatisticsElement.sets,
      exerciseStatisticsElement.setsDynamics
    );

    exerciseStatisticsElement.repeatsDynamics = getPercentDiff(
      exerciseStatisticsElement.repeats,
      exerciseStatisticsElement.repeatsDynamics
    );

    exerciseStatisticsElement.averageDuration =
      exerciseStatisticsElement.averageDuration / exerciseStatisticsElement.repeats || 0;

    exerciseStatistics.push(exerciseStatisticsElement);
  });

  return exerciseStatistics.sort((a, b) => b.sets - a.sets);
}

export async function activitiesGetChartData(
  Entity: Model<IActivity>,
  weeks: IWeekDays[],
  type: TActivityChartType,
  locale: string,
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
    const activitiesCount = await Entity.find(filter).countDocuments().exec();

    labels.push(week.label);

    if (type === 'activity') generateActivitiesChart(activitiesCount, activitiesGoal, datasets, locale);

    if (type === 'set') await generateSetsChart(Entity, filter, activitiesCount, setsGoal, isAverage, datasets, locale);

    if (type === 'repeat')
      await generateRepeatsChart(Entity, filter, activitiesCount, repeatsGoal, isAverage, datasets, locale);

    if (type === 'muscle')
      await generateMusclesChart(Entity, filter, activitiesCount, muscles, isAverage, datasets, locale);

    if (type === 'duration')
      await generateDurationChart(Entity, filter, activitiesCount, durationGoal, isAverage, datasets, locale);
  }

  return { labels, datasets };
}
