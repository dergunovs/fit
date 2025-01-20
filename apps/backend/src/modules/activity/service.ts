import type { IActivity, TActivityChartType, IActivityService, TDecode } from 'fitness-tracker-contracts';

import { decodeToken } from '../auth/helpers.js';
import { paginate, getDatesByDayGap, getFirstAndLastWeekDays } from '../common/helpers.js';
import Exercise from '../exercise/model.js';
import User from '../user/model.js';
import Activity from './model.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';

export const activityService: IActivityService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(Activity, page, '-dateCreated', [
      {
        path: 'exercises.exercise',
        select: ['_id', 'title', 'muscleGroups', 'createdBy'],
        populate: { path: 'createdBy', select: ['_id', 'name', 'email'] },
      },
      { path: 'createdBy', select: ['_id', 'name', 'email'] },
    ]);

    return { data: data as T[], total };
  },

  getStatistics: async (gap: number, decode?: TDecode, token?: string) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id name role email equipments')
      .populate({ path: 'equipments.equipment' })
      .lean()
      .exec();

    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const activities = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activitiesPrev = await Activity.find({
      dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) },
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activityStatistics = activitiesGetStatistics(activities, activitiesPrev);

    const exercises = await Exercise.find()
      .select('_id title equipment equipmentForWeight isWeightsRequired')
      .populate([{ path: 'equipment' }, { path: 'equipmentForWeight' }])
      .lean()
      .exec();

    const exerciseStatistics = exerciseGetStatistics(activities, activitiesPrev, exercises, user);

    return { activity: activityStatistics, exercise: exerciseStatistics };
  },

  getCalendar: async <T>(dateFrom: string, dateTo: string, decode?: TDecode, token?: string) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id')
      .lean()
      .exec();

    const calendarData = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      createdBy: user?._id,
    })
      .populate([
        {
          path: 'exercises.exercise',
          select: ['_id', 'title', 'muscleGroups', 'createdBy'],
          populate: { path: 'createdBy', select: ['_id', 'name', 'email'] },
        },
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
      ])
      .lean()
      .exec();

    return calendarData as T[];
  },

  getChart: async (type: TActivityChartType, decode?: TDecode, token?: string) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id')
      .lean()
      .exec();

    const weeks = getFirstAndLastWeekDays(7);

    const { labels, datasets } = await activitiesGetChartData(Activity, weeks, type, user);

    return { labels, datasets };
  },

  getOne: async <T>(_id: string) => {
    const activity: IActivity | null = await Activity.findOne({ _id })
      .populate([
        {
          path: 'exercises.exercise',
          select: ['_id', 'title', 'muscleGroups', 'createdBy'],
          populate: { path: 'createdBy', select: ['_id', 'name', 'email'] },
        },
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
      ])
      .lean()
      .exec();

    return { data: activity as T };
  },

  getLast: async <T>() => {
    const activity: IActivity | null = await Activity.findOne()
      .sort('-dateCreated')
      .populate([
        {
          path: 'exercises.exercise',
          select: ['_id', 'title', 'muscleGroups', 'createdBy'],
          populate: { path: 'createdBy', select: ['_id', 'name', 'email'] },
        },
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
      ])
      .lean()
      .exec();

    return { data: activity as T };
  },

  create: async <T>(activityToCreate: T, decode?: TDecode, token?: string) => {
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
