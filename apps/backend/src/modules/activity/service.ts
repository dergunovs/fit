import type { IActivity, TActivityChartType, TDecode, TLocale } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { adminOrUserFilter, getAuthenticatedUser, allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import { getAdminAndUserExercises } from '../exercise/helpers.js';
import { error } from '../common/errorHandler.js';
import { checkInvalidId } from '../common/helpers.js';
import { USER_POPULATE } from '../user/constants.js';
import User from '../user/model.js';
import Muscle from '../muscle/model.js';
import { activityRepository } from './repository.js';
import { getActivitiesStatistics, getExercisesStatistics, getActivitiesChartData } from './helpers.js';

export const activityService = {
  getMany: async (page?: number) => {
    const { data, total } = await activityRepository.getMany(page);

    return { data, total };
  },

  getStatistics: async (gap: number, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const [user, exercises] = await Promise.all([
      User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean(),
      getAdminAndUserExercises(decode, token),
    ]);

    if (!user) throw error.notFound();

    const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(gap);

    const activities: { current: IActivity[]; previous: IActivity[] }[] = await activityRepository.getStatistics(
      user._id,
      new Date(dateFrom),
      new Date(dateTo),
      new Date(dateFromPrev),
      new Date(dateToPrev)
    );

    const { current, previous } = activities[0];

    const activityStatistics = getActivitiesStatistics(current, previous);

    const exerciseStatistics = getExercisesStatistics(current, previous, exercises, user);

    return { activity: activityStatistics, exercise: exerciseStatistics };
  },

  getCalendar: async (dateFrom: string, dateTo: string, decode?: TDecode, token?: string) => {
    const filter = adminOrUserFilter(decode, token);

    const user = await User.findOne(filter).select('_id').lean();

    if (!user) throw error.notFound();

    const calendarData = await activityRepository.getCalendar(user._id, new Date(dateFrom), new Date(dateTo));

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

    if (!user) throw error.notFound();

    const isMonth = month === 'true';

    const weeks = getFirstAndLastDays(7, isMonth);

    const { labels, datasets } = await getActivitiesChartData(
      activityRepository,
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

    const activity = await activityRepository.getOne(_id);

    if (!activity?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    return { data: activity };
  },

  create: async (activityToCreate: IActivity, decode?: TDecode, token?: string) => {
    const user = getAuthenticatedUser(decode, token);

    const newActivityId = await activityRepository.create({ ...activityToCreate, createdBy: user });

    if (!newActivityId) throw error.internal();

    return newActivityId;
  },

  update: async (_id: string, itemToUpdate: IActivity, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await activityRepository.findActivityById(_id);

    if (!activity?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activityRepository.updateOne(activity, itemToUpdate);
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    const activity = await activityRepository.findActivityById(_id);

    if (!activity?.createdBy?._id) throw error.notFound();

    allowAccessToAdminAndCurrentUser(activity.createdBy._id, decode, token);

    await activityRepository.deleteOne(activity);
  },
};
