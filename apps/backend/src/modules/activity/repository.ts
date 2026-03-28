import type { IActivity } from 'fitness-tracker-contracts';
import mongoose from 'mongoose';

import { IChartFilter } from '../common/types.js';
import { paginate } from '../common/helpers.js';
import { ACTIVITY_POPULATE } from './constants.js';
import Activity from './model.js';

export interface IActivityRepository {
  getMany: (page?: number) => Promise<{ data: IActivity[]; total: number }>;
  getOne: (_id: string) => Promise<IActivity | null>;
  getStatistics: (
    userId: string,
    dateFrom: Date,
    dateTo: Date,
    dateFromPrev: Date,
    dateToPrev: Date
  ) => Promise<{ current: IActivity[]; previous: IActivity[] }[]>;
  getCalendar: (userId: string, dateFrom: Date, dateTo: Date) => Promise<IActivity[]>;
  getChartActivities: (filter: IChartFilter) => Promise<IActivity[]>;
  getMuscleActivities: (filter: IChartFilter) => Promise<IActivity[]>;
  create: (data: Partial<IActivity>) => Promise<string>;
  findActivityById: (_id: string) => Promise<InstanceType<typeof Activity> | null>;
  updateOne: (activity: InstanceType<typeof Activity>, data: Partial<IActivity>) => Promise<void>;
  deleteOne: (activity: InstanceType<typeof Activity>) => Promise<void>;
}

export function createActivityRepository(): IActivityRepository {
  return {
    getMany: async (page?: number) => {
      return paginate(Activity, page, '-dateCreated', ACTIVITY_POPULATE);
    },

    getOne: async (_id: string) => {
      return Activity.findOne({ _id }).populate(ACTIVITY_POPULATE).lean();
    },

    getStatistics: async (userId: string, dateFrom: Date, dateTo: Date, dateFromPrev: Date, dateToPrev: Date) => {
      const objectId = new mongoose.Types.ObjectId(userId);

      return Activity.aggregate([
        { $match: { createdBy: objectId, isDone: true } },
        {
          $facet: {
            current: [{ $match: { dateCreated: { $gte: dateFrom, $lt: dateTo } } }],
            previous: [{ $match: { dateCreated: { $gte: dateFromPrev, $lt: dateToPrev } } }],
          },
        },
      ]);
    },

    getCalendar: async (userId: string, dateFrom: Date, dateTo: Date) => {
      const objectId = new mongoose.Types.ObjectId(userId);

      return Activity.find({
        createdBy: objectId as unknown as IActivity['createdBy'],
        $or: [
          { dateScheduled: { $gte: dateFrom, $lte: dateTo, $ne: null } },
          { dateScheduled: null, dateCreated: { $gte: dateFrom, $lte: dateTo } },
        ],
      })
        .populate(ACTIVITY_POPULATE)
        .lean();
    },

    getChartActivities: async (filter: IChartFilter) => {
      return Activity.find(filter).lean();
    },

    getMuscleActivities: async (filter: IChartFilter) => {
      return Activity.find(filter).select('_id exercises dateCreated').populate(ACTIVITY_POPULATE).lean();
    },

    create: async (data: Partial<IActivity>) => {
      const activity = new Activity(data);
      const newActivity = await activity.save();

      return newActivity._id;
    },

    findActivityById: async (_id: string) => {
      return Activity.findOne({ _id });
    },

    updateOne: async (activity: InstanceType<typeof Activity>, data: Partial<IActivity>) => {
      await activity.updateOne({ ...data, dateScheduled: '', dateUpdated: new Date() });
      await activity.save();
    },

    deleteOne: async (activity: InstanceType<typeof Activity>) => {
      await activity.deleteOne();
    },
  };
}
