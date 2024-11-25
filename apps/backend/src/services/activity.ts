import type {
  IActivity,
  IActivityStatistics,
  IExerciseStatistics,
  TActivityChartType,
} from 'fitness-tracker-contracts';

import Activity from '../models/activity.js';
import Exercise from '../models/exercise.js';

import { paginate, getFirstAndLastWeekDays } from '../helpers/index.js';
import { IActivityService } from '../interface/index.js';

export const activityService: IActivityService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(Activity, page);

    return { data: data as T[], total };
  },

  getStatistics: async () => {
    const activities = await Activity.find()
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const exercises = await Exercise.find().select(['_id', 'title']).lean().exec();

    const activitiesCount = activities.length;
    const setsCount = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);
    const repeatsCount = activities.reduce(
      (acc, current) => acc + current.exercises.reduce((accEx, currentEx) => accEx + (currentEx.repeats || 0), 0),
      0
    );
    const duration = activities.reduce((acc, current) => {
      const dateFrom = new Date(current.dateUpdated || 0);
      const dateTo = new Date(current.dateCreated || 0);

      const diff = Math.floor(((dateFrom as unknown as number) - (dateTo as unknown as number)) / 1000);

      return acc + diff || 0;
    }, 0);

    const averageSetsPerActivity = Math.round(setsCount / activitiesCount);
    const averageRepeatsPerSet = Math.round(repeatsCount / setsCount);
    const averageDuration = Math.round(duration / activitiesCount);

    const exercisesDurationSumm = activities.reduce((acc, currentActivity) => {
      const exercisesDuration = currentActivity.exercises.reduce(
        (accEx, currentEx) => accEx + (currentEx.duration || 0),
        0
      );

      return acc + exercisesDuration || 0;
    }, 0);

    const averageRestPercent = Math.floor(100 - (exercisesDurationSumm / duration) * 100);

    const activityStatistics: IActivityStatistics = {
      activitiesCount,
      setsCount,
      repeatsCount,
      duration,
      averageSetsPerActivity,
      averageRepeatsPerSet,
      averageDuration,
      averageRestPercent,
    };

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

        exerciseStatisticsElement.repeats += filteredExercises.reduce(
          (acc, current) => acc + (current.repeats || 0),
          0
        );

        exerciseStatisticsElement.averageDuration += filteredExercises.reduce(
          (acc, current) => acc + (current.duration || 0),
          0
        );
      });

      exerciseStatisticsElement.averageDuration =
        exerciseStatisticsElement.averageDuration / exerciseStatisticsElement.repeats || 0;

      exerciseStatistics.push(exerciseStatisticsElement);
    });

    return { activity: activityStatistics, exercise: exerciseStatistics.sort((a, b) => b.sets - a.sets) };
  },

  getCalendar: async <T>(dateFrom: string, dateTo: string) => {
    const data = await Activity.find({ dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) } })
      .populate({ path: 'exercises.exercise', select: ['title', 'muscleGroups'] })
      .lean()
      .exec();

    return data as T[];
  },

  getChart: async (type: TActivityChartType) => {
    const weeks = getFirstAndLastWeekDays(5);

    const labels: string[] = [];
    const data: number[] = [];

    for (const week of weeks) {
      labels.push(week.label);

      if (type === 'activity') {
        const count = await Activity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
          .countDocuments()
          .exec();

        data.push(count);
      }

      if (type === 'set') {
        const activities = await Activity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
          .select('_id exercises dateCreated')
          .populate({ path: 'exercises' })
          .lean()
          .exec();

        const count = activities.reduce((acc, current) => acc + (current.exercises.length || 0), 0);

        data.push(count);
      }

      if (type === 'repeat') {
        const activities = await Activity.find({ dateCreated: { $gte: week.dateFrom, $lt: week.dateTo } })
          .select('_id exercises dateCreated')
          .populate({ path: 'exercises.exercise', select: ['title'] })
          .lean()
          .exec();

        let count = 0;

        activities.forEach((activity) => {
          const repeats = activity.exercises.reduce((acc, current) => acc + (current.repeats || 0), 0);

          count += repeats;
        });

        data.push(count);
      }
    }

    return { labels, data };
  },

  getOne: async <T>(_id: string) => {
    const activity: IActivity | null = await Activity.findOne({ _id })
      .populate({ path: 'exercises.exercise', select: ['title', 'muscleGroups'] })
      .lean()
      .exec();

    return { data: activity as T };
  },

  getLast: async <T>() => {
    const activity: IActivity | null = await Activity.findOne()
      .sort('-dateCreated')
      .populate({ path: 'exercises.exercise', select: ['title', 'muscleGroups'] })
      .lean()
      .exec();

    return { data: activity as T };
  },

  update: async <T>(itemToUpdate: T, _id?: string) => {
    await Activity.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  create: async <T>(activityToCreate: T) => {
    const activity = new Activity(activityToCreate);

    const newActivity = await activity.save();

    const id = newActivity._id.toString();

    return id;
  },

  delete: async (_id?: string) => {
    const activity = await Activity.findOne({ _id });

    await activity?.deleteOne();
  },
};
