import type { IActivity, TActivityChartType, IActivityService, TDecode } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { allowAccessToAdminAndCurrentUser, decodeToken } from '../auth/helpers.js';
import { getAdminAndUserExercises } from '../exercise/helpers.js';
import { paginate } from '../common/helpers.js';
import User from '../user/model.js';
import Muscle from '../muscle/model.js';
import Activity from './model.js';
import { activitiesGetStatistics, exerciseGetStatistics, activitiesGetChartData } from './helpers.js';

export const activityService: IActivityService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(Activity, page, '-dateCreated', [
      {
        path: 'exercises.exercise',
        select: ['_id', 'title', 'title_en', 'muscles', 'createdBy'],
        populate: [
          { path: 'createdBy', select: ['_id', 'name', 'email'] },
          { path: 'muscles', select: ['_id', 'title', 'color'] },
        ],
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
      isDone: true,
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activitiesPrev = await Activity.find({
      dateCreated: { $gte: new Date(dateFromPrev), $lt: new Date(dateToPrev) },
      isDone: true,
      createdBy: user?._id,
    })
      .select('_id exercises dateCreated dateUpdated')
      .populate({ path: 'exercises' })
      .lean()
      .exec();

    const activityStatistics = activitiesGetStatistics(activities, activitiesPrev);

    const exercises = await getAdminAndUserExercises(decode, token);

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
          select: ['_id', 'title', 'title_en', 'muscles', 'createdBy'],
          populate: [{ path: 'createdBy', select: ['_id', 'name', 'email'] }, { path: 'muscles' }],
        },
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
      ])
      .lean()
      .exec();

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
      .lean()
      .exec();

    const weeks = getFirstAndLastDays(7, month === 'true');

    const muscles = await Muscle.find().lean().exec();

    const { labels, datasets } = await activitiesGetChartData(
      Activity,
      weeks,
      type,
      locale,
      user,
      muscles,
      average === 'true'
    );

    return { labels, datasets };
  },

  getOne: async <T>(_id: string, decode?: TDecode, token?: string) => {
    const activity: IActivity | null = await Activity.findOne({ _id })
      .populate([
        {
          path: 'exercises.exercise',
          select: ['_id', 'title', 'title_en', 'muscles', 'createdBy'],
          populate: [{ path: 'createdBy', select: ['_id', 'name', 'email'] }, { path: 'muscles' }],
        },
        { path: 'createdBy', select: ['_id', 'name', 'email'] },
      ])
      .lean()
      .exec();

    if (!activity?.createdBy?._id) return { data: null };

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    return { data: activity as T };
  },

  getLast: async <T>(decode?: TDecode, token?: string) => {
    const user = decodeToken(decode, token);

    const activity: IActivity | null = await Activity.findOne({ createdBy: user?._id })
      .sort('-dateCreated')
      .populate([
        {
          path: 'exercises.exercise',
          select: ['_id', 'title', 'title_en', 'muscles', 'createdBy'],
          populate: [{ path: 'createdBy', select: ['_id', 'name', 'email'] }, { path: 'muscles' }],
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

  update: async <T>(_id: string, itemToUpdate: T, decode?: TDecode, token?: string) => {
    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.updateOne({ ...itemToUpdate, dateScheduled: '', dateUpdated: new Date() });

    await activity.save();
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    const activity = await Activity.findOne({ _id });

    if (!activity?.createdBy?._id) return;

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activity.deleteOne();
  },
};
