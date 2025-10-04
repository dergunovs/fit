import type { IActivity, TActivityChartType, TDecode, TLocale } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { adminOrUserFilter, allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';
import { getAdminAndUserExercises } from '../exercise/helpers.js';
import { paginate, checkInvalidId } from '../common/helpers.js';
import { USER_POPULATE } from '../user/constants.js';
import User from '../user/model.js';
import Muscle from '../muscle/model.js';
import Activity from './model.js';
import { ACTIVITY_POPULATE } from './constants.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';

export const activityService = {
  getMany: async (page?: number) => {
    const { data, total } = await paginate(Activity, page, '-dateCreated', ACTIVITY_POPULATE);

    return { data, total };
  },

  getStatistics: async (gap: number, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const user = await User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean();

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const activities: { current: IActivity[]; previous: IActivity[] }[] = await Activity.aggregate([
      { $match: { createdBy: user._id, isDone: true } },
      {
        $facet: {
          current: [{ $match: { dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) } } }],
          previous: [{ $match: { dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) } } }],
        },
      },
    ]);

    const { current, previous } = activities[0];

    const [activityStatistics, exercises] = await Promise.all([
      Promise.resolve(activitiesGetStatistics(current, previous)),
      getAdminAndUserExercises(decode, token),
    ]);

    const exerciseStatistics = exerciseGetStatistics(current, previous, exercises, user);

    return { activity: activityStatistics, exercise: exerciseStatistics };
  },

  getCalendar: async (dateFrom: string, dateTo: string, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const user = await User.findOne(filter).select('_id').lean();

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

    const calendarData = await Activity.find({
      dateCreated: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
      createdBy: user._id,
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
      User.findOne(filter).select('_id goalActivities goalSets goalRepeats goalDuration').lean(),
      Muscle.find().lean(),
    ]);

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

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

    if (!activity?.createdBy?._id) throw new Error('Activity not found', { cause: { code: 404 } });

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    return { data: activity };
  },

  create: async (activityToCreate: IActivity, decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

    const activity = new Activity({ ...activityToCreate, createdBy: user._id });

    const newActivity = await activity.save();

    if (!newActivity._id) throw new Error('Activity not created', { cause: { code: 500 } });

    return newActivity._id;
  },

  update: async (_id: string, itemToUpdate: IActivity, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) throw new Error('Activity not found', { cause: { code: 404 } });

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.updateOne({ ...itemToUpdate, dateScheduled: '', dateUpdated: new Date() });

    await activity.save();
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) throw new Error('Activity not found', { cause: { code: 404 } });

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.deleteOne();
  },
};
