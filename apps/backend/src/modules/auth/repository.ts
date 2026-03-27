import { USER_POPULATE } from '../user/constants.js';
import User from '../user/model.js';

export const authRepository = {
  findByEmail: async (email: string) => {
    return User.findOne({ email }).populate(USER_POPULATE).lean();
  },

  findByEmailWithPassword: async (email: string) => {
    return User.findOne({ email }).populate(USER_POPULATE);
  },

  countUsers: async () => {
    return User.countDocuments();
  },

  countByEmail: async (email: string) => {
    return User.countDocuments({ email });
  },

  createUser: async (data: {
    email: string;
    password: string;
    name?: string;
    isEmailConfirmed?: boolean;
    role?: string;
    confirmationToken?: string;
  }) => {
    await User.create(data);
  },

  updateByEmail: async (
    filter: { email: string; isEmailConfirmed?: boolean; confirmationToken?: string },
    data: { [key: string]: unknown }
  ) => {
    await User.updateOne(filter, { $set: data });
  },

  updateById: async (_id: string, data: { [key: string]: unknown }) => {
    await User.updateOne({ _id }, { $set: data });
  },

  saveUser: async (user: InstanceType<typeof User>) => {
    await user.save();
  },
};
