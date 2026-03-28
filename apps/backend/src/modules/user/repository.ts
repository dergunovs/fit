import type { IUser } from 'fitness-tracker-contracts';

import { paginate } from '../common/helpers.js';
import { USER_POPULATE } from './constants.js';
import User from './model.js';

export const userRepository = {
  getMany: async (page?: number) => {
    return paginate(User, page, '-dateCreated', USER_POPULATE);
  },

  getOne: async (_id: string) => {
    return User.findOne({ _id })
      .select(
        '_id name role email equipments defaultWeights isResetPassword templates goalActivities goalSets goalRepeats goalDuration'
      )
      .populate(USER_POPULATE)
      .lean();
  },

  findByFilter: async (filter: { [key: string]: unknown }) => {
    return User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean();
  },

  findByFilterWithEquipments: async (filter: { [key: string]: unknown }) => {
    return User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean();
  },

  create: async (user: IUser) => {
    const newUser = new User(user);

    await newUser.save();

    return newUser;
  },

  updateOne: async (_id: string, data: Partial<IUser>) => {
    return User.findOneAndUpdate({ _id }, { ...data, dateUpdated: new Date() });
  },

  updatePassword: async (_id: string, hashedPassword: string) => {
    return User.findOneAndUpdate(
      { _id },
      { password: hashedPassword, passwordTemporary: '', isResetPassword: false, dateUpdated: new Date() }
    );
  },

  deleteOne: async (_id: string) => {
    return User.findOneAndDelete({ _id });
  },

  findUserForActivityStats: async (filter: { [key: string]: unknown }) => {
    return User.findOne(filter).select('_id name role email equipments').populate(USER_POPULATE).lean();
  },

  findUserForChart: async (filter: { [key: string]: unknown }) => {
    return User.findOne(filter).select('_id goalActivities goalSets goalRepeats goalDuration').lean();
  },
};
