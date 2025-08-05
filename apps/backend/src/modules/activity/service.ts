import type { IActivity, TActivityChartType, IActivityService, TDecode } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';
import { getAdminAndUserExercises } from '../exercise/helpers.js';
import { paginate, checkInvalidId } from '../common/helpers.js';
import User from '../user/model.js';
import Muscle from '../muscle/model.js';
import Activity from './model.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';
import { ACTIVITY_POPULATE } from './constants.js';

export const activityService: IActivityService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(Activity, page, '-dateCreated', ACTIVITY_POPULATE);

    return { data: data as T[], total };
  },

  getStatistics: async (gap: number, decode?: TDecode, token?: string) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id name role email equipments')
      .populate({ path: 'equipments.equipment' })
      .lean();

    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const activities = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      isDone: true,
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean();

    const activitiesPrev = await Activity.find({
      dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) },
      isDone: true,
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean();

    const activityStatistics = activitiesGetStatistics(activities, activitiesPrev);

    const exercises = await getAdminAndUserExercises(decode, token);

    const exerciseStatistics = exerciseGetStatistics(activities, activitiesPrev, exercises, user);

    return { activity: activityStatistics, exercise: exerciseStatistics };
  },

  getCalendar: async <T>(dateFrom: string, dateTo: string, decode?: TDecode, token?: string) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id')
      .lean();

    const calendarData = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      createdBy: user?._id,
    })
      .populate(ACTIVITY_POPULATE)
      .lean();

    return calendarData as T[];
  },

  getChart: async (
    type: TActivityChartType,
    month: string,
    average: string,
    locale: string,
    decode?: TDecode,
    token?: string
  ) => {
    const decodedUser = decodeToken(decode, token);

    const user = await User.findOne(decodedUser ? { email: decodedUser.email } : { role: 'admin' })
      .select('_id')
      .lean();

    const weeks = getFirstAndLastDays(7, month === 'true');

    const muscles = await Muscle.find().lean();

    const { labels, datasets } = await activitiesGetChartData(
      Activity,
      weeks,
      type,
      locale,
      user,
      muscles,
      month === 'true',
      average === 'true'
    );

    return { labels, datasets };
  },

  getOne: async <T>(_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity: IActivity | null = await Activity.findOne({ _id }).populate(ACTIVITY_POPULATE).lean();

    if (!activity?.createdBy?._id) return { data: null };

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    return { data: activity as T };
  },

  getLast: async <T>(decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const activity: IActivity | null = await Activity.findOne({ createdBy: user?._id })
      .sort('-dateCreated')
      .populate(ACTIVITY_POPULATE)
      .lean();

    return { data: activity as T };
  },

  create: async <T>(activityToCreate: T, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const activity = new Activity({ ...activityToCreate, createdBy: user?._id });

    const newActivity = await activity.save();

    const id = newActivity._id.toString();

    return id;
  },

  update: async <T>(_id: string, itemToUpdate: T, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.updateOne({ ...itemToUpdate, dateScheduled: '', dateUpdated: new Date() });

    await activity.save();
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.deleteOne();
  },
};
