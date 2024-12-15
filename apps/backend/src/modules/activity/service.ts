import type { IActivity, TActivityChartType, IActivityService, IToken } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { paginate, getDatesByDayGap, getFirstAndLastWeekDays } from '../common/helpers.js';
import Exercise from '../exercise/model.js';
import Activity from './model.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';

export const activityService: IActivityService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(Activity, page);

    return { data: data as T[], total };
  },

  getStatistics: async (gap: number) => {
    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const activities = await Activity.find({ dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) } })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activitiesPrev = await Activity.find({
      dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) },
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activityStatistics = activitiesGetStatistics(activities, activitiesPrev);

    const exercises = await Exercise.find().select(['_id', 'title']).lean().exec();

    const exerciseStatistics = exerciseGetStatistics(activities, activitiesPrev, exercises);

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
    const weeks = getFirstAndLastWeekDays(7);

    const { labels, datasets } = await activitiesGetChartData(Activity, weeks, type);

    return { labels, datasets };
  },

  getOne: async <T>(_id: string) => {
    const activity: IActivity | null = await Activity.findOne({ _id })
      .populate([
        { path: 'exercises.exercise', select: ['title', 'muscleGroups'] },
        { path: 'createdBy', select: ['_id', 'name'] },
      ])
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

  create: async <T>(activityToCreate: T, decode?: (token: string) => IToken | null, token?: string) => {
    const user = decodeToken(decode, token);

    const activity = new Activity({ ...activityToCreate, createdBy: user?._id });

    const newActivity = await activity.save();

    const id = newActivity._id.toString();

    return id;
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    await Activity.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id?: string) => {
    const activity = await Activity.findOne({ _id });

    await activity?.deleteOne();
  },
};
