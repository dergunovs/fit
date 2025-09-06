import bcrypt from 'bcryptjs';
import type { IUserFeedback, IUser, TDecode } from 'fitness-tracker-contracts';

import { checkInvalidId, paginate, sendMail } from '../common/helpers.js';
import { allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import User from './model.js';
import { USER_POPULATE } from './constants.js';

export const userService = {
  getMany: async (page?: number) => {
    const { data, total } = await paginate(User, page, '-dateCreated', USER_POPULATE);

    return { data, total };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const user = await User.findOne({ _id })
      .select(
        '_id name role email equipments defaultWeights isResetPassword templates goalActivities goalSets goalRepeats goalDuration'
      )
      .populate(USER_POPULATE)
      .lean();

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

    return { data: user };
  },

  create: async (userToCreate: IUser) => {
    const user = new User(userToCreate);

    if (!user.password) throw new Error('User create error', { cause: { code: 500 } });

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
  },

  update: async (_id: string, itemToUpdate: IUser, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    await User.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  updatePassword: async (_id: string, password: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    const newPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { _id },
      { password: newPassword, passwordTemporary: '', isResetPassword: false, dateUpdated: new Date() }
    );
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    await User.findOneAndDelete({ _id });
  },

  feedback: async (feedback: IUserFeedback) => {
    const template = `Обратная связь от пользователя ${feedback.name} (${feedback.email}): ${feedback.message}`;

    await sendMail(template, `${process.env.EMAIL_USER}`);
  },
};
