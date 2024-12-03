import type { IActivity, TActivityChartType, IActivityService } from 'fitness-tracker-contracts';

import { paginate, getFirstAndLastWeekDays } from '../common/helpers.js';
import Exercise from '../exercise/model.js';
import Activity from './model.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';

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

    const activityStatistics = activitiesGetStatistics(activities);

    const exercises = await Exercise.find().select(['_id', 'title']).lean().exec();

    const exerciseStatistics = exerciseGetStatistics(activities, exercises);

    return { activity: activityStatistics, exercise: exerciseStatistics };
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

    const { labels, data } = await activitiesGetChartData(Activity, weeks, type);

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

  update: async <T>(_id: string, itemToUpdate: T) => {
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
