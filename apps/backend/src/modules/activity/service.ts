import type { IActivity, IUser, TActivityChartType, TLocale } from 'fitness-tracker-contracts';
import { getDatesByDayGap, getFirstAndLastDays } from 'mhz-helpers';

import { adminOrUserFilter, allowAccessToAdminAndCurrentUser } from '../auth/helpers.ts';
import { getAdminAndUserExercises } from '../exercise/helpers.ts';
import { error } from '../common/errorHandler.ts';
import { checkInvalidId } from '../common/helpers.ts';
import type { IUserRepository } from '../user/repository.ts';
import type { IMuscleRepository } from '../muscle/repository.ts';
import type { IExerciseRepository } from '../exercise/repository.ts';
import type { IActivityRepository } from './repository.ts';
import { getActivitiesStatistics, getExercisesStatistics, getActivitiesChartData } from './helpers.ts';

export function createActivityService(deps: {
  activityRepository: IActivityRepository;
  userRepository: IUserRepository;
  muscleRepository: IMuscleRepository;
  exerciseRepository: IExerciseRepository;
}) {
  const { activityRepository, userRepository, muscleRepository, exerciseRepository } = deps;

  return {
    getMany: async (page?: number) => {
      const { data, total } = await activityRepository.getMany(page);

      return { data, total };
    },

    getStatistics: async (gap: string, user?: IUser) => {
      const filter = adminOrUserFilter(user);

      const [foundUser, exercises] = await Promise.all([
        userRepository.findUserForActivityStats(filter),
        getAdminAndUserExercises(exerciseRepository, user),
      ]);

      if (!foundUser) throw error.notFound();

      const { dateFrom, dateTo, dateFromPrev, dateToPrev } = getDatesByDayGap(Number(gap));

      const activities: { current: IActivity[]; previous: IActivity[] }[] = await activityRepository.getStatistics(
        foundUser._id as string,
        dateFrom,
        dateTo,
        dateFromPrev,
        dateToPrev
      );

      const { current, previous } = activities[0];

      const activityStatistics = getActivitiesStatistics(current, previous);

      const exerciseStatistics = getExercisesStatistics(current, previous, exercises, foundUser);

      return { activity: activityStatistics, exercise: exerciseStatistics };
    },

    getCalendar: async (dateFrom: string, dateTo: string, user?: IUser) => {
      const filter = adminOrUserFilter(user);

      const foundUser = await userRepository.findUserForActivityStats(filter);

      if (!foundUser) throw error.notFound();

      const calendarData = await activityRepository.getCalendar(
        foundUser._id as string,
        new Date(dateFrom),
        new Date(dateTo)
      );

      return calendarData;
    },

    getChart: async (type: TActivityChartType, month: string, average: string, locale: TLocale, user?: IUser) => {
      const filter = adminOrUserFilter(user);

      const [foundUser, muscles] = await Promise.all([
        userRepository.findUserForChart(filter),
        muscleRepository.findAll(),
      ]);

      if (!foundUser) throw error.notFound();

      const isMonth = month === 'true';

      const weeks = getFirstAndLastDays(7, isMonth);

      const { labels, datasets } = await getActivitiesChartData(
        activityRepository,
        weeks,
        type,
        locale,
        foundUser,
        muscles,
        isMonth,
        average === 'true'
      );

      return { labels, datasets };
    },

    getOne: async (_id: string, user: IUser) => {
      checkInvalidId(_id);

      const activity = await activityRepository.getOne(_id);

      if (!activity?.createdBy?._id) throw error.notFound();

      allowAccessToAdminAndCurrentUser(activity.createdBy._id, user);

      return { data: activity };
    },

    create: async (activityToCreate: IActivity, user: IUser) => {
      const newActivityId = await activityRepository.create({ ...activityToCreate, createdBy: user });

      if (!newActivityId) throw error.internal();

      return newActivityId;
    },

    update: async (_id: string, itemToUpdate: IActivity, user: IUser) => {
      checkInvalidId(_id);

      const activity = await activityRepository.findActivityById(_id);

      if (!activity?.createdBy?._id) throw error.notFound();

      allowAccessToAdminAndCurrentUser(activity.createdBy._id, user);

      await activityRepository.updateOne(activity, itemToUpdate);
    },

    delete: async (_id: string, user: IUser) => {
      checkInvalidId(_id);

      const activity = await activityRepository.findActivityById(_id);

      if (!activity?.createdBy?._id) throw error.notFound();

      allowAccessToAdminAndCurrentUser(activity.createdBy._id, user);

      await activityRepository.deleteOne(activity);
    },
  };
}
