import type { IActivity, TActivityChartType, TDecode, TLocale } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';
import { getAdminAndUserExercises } from '../exercise/helpers.js';
import { paginate, checkInvalidId } from '../common/helpers.js';
import { USER_POPULATE } from '../user/constants.js';
import User from '../user/model.js';
import Muscle from '../muscle/model.js';
import Activity from './model.js';
import { ACTIVITY_POPULATE } from './constants.js';
import {
  activitiesGetStatistics,
  exerciseGetStatistics,
  activitiesGetChartData,
  adminOrUserFilter,
} from './helpers.js';

export const activityService = {
  getMany: async (page?: number) => {
    const { data, total } = await paginate(Activity, page, '-dateCreated', ACTIVITY_POPULATE);

    return { data, total };
  },

  getStatistics: async (gap: number, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const user = await User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean();

    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const [activities, activitiesPrev] = await Promise.all([
      Activity.find({
        dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
        isDone: true,
        createdBy: user?._id,
      })
        .select('_id exercises dateCreated dateUpdated')
        .populate(ACTIVITY_POPULATE)
        .lean(),

      Activity.find({
        dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) },
        isDone: true,
        createdBy: user?._id,
      })
        .select('_id exercises dateCreated dateUpdated')
        .populate(ACTIVITY_POPULATE)
        .lean(),
    ]);

    const [activityStatistics, exercises] = await Promise.all([
      Promise.resolve(activitiesGetStatistics(activities, activitiesPrev)),
      getAdminAndUserExercises(decode, token),
    ]);

    const exerciseStatistics = exerciseGetStatistics(activities, activitiesPrev, exercises, user);

    return { activity: activityStatistics, exercise: exerciseStatistics };
  },

  getCalendar: async (dateFrom: string, dateTo: string, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const user = await User.findOne(filter).select('_id').lean();

    const calendarData = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      createdBy: user?._id,
    })
      .populate(ACTIVITY_POPULATE)
      .lean();

    return calendarData;
  },

  getChart: async (
    type: TActivityChartType,
    month: string,
    average: string,
    locale: TLocale,
    decode?: TDecode,
    token?: string
  ) => {
    const filter = adminOrUserFilter(decode, token);

    const [user, muscles] = await Promise.all([
      await User.findOne(filter).select('_id').lean(),
      await Muscle.find().lean(),
    ]);

    const isMonth = month === 'true';

    const weeks = getFirstAndLastDays(7, isMonth);

    const { labels, datasets } = await activitiesGetChartData(
      Activity,
      weeks,
      type,
      locale,
      user,
      muscles,
      isMonth,
      average === 'true'
    );

    return { labels, datasets };
  },

  getOne: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await Activity.findOne({ _id }).populate(ACTIVITY_POPULATE).lean();

    if (!activity?.createdBy?._id) return { data: null };

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    return { data: activity };
  },

  getLast: async (decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const activity = await Activity.findOne({ createdBy: user?._id })
      .sort('-dateCreated')
      .populate(ACTIVITY_POPULATE)
      .lean();

    return { data: activity };
  },

  create: async (activityToCreate: IActivity, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const activity = new Activity({ ...activityToCreate, createdBy: user?._id });

    const newActivity = await activity.save();

    if (!newActivity._id) throw new Error('Activity not created', { cause: { code: 500 } });

    return newActivity._id;
  },

  update: async (_id: string, itemToUpdate: IActivity, decode?: TDecode, token?: string) => {
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
