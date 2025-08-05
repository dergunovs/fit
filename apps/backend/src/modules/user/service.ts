import bcrypt from 'bcryptjs';
import type { IUserFeedback, IUserService, TDecode } from 'fitness-tracker-contracts';

import { checkInvalidId, paginate, sendMail } from '../common/helpers.js';
import { allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import User from './model.js';
import { USER_POPULATE } from './constants.js';

export const userService: IUserService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(User, page, '-dateCreated', USER_POPULATE);

    return { data: data as T[], total };
  },

  getOne: async <T>(_id: string) => {
    checkInvalidId(_id);

    const user = await User.findOne({ _id })
      .select('_id name role email equipments defaultWeights isResetPassword')
      .populate(USER_POPULATE)
      .lean();

    return { data: user as T };
  },

  create: async <T>(userToCreate: T) => {
    const user = new User(userToCreate);

    if (!user.password) return;

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
  },

  update: async <T>(_id: string, itemToUpdate: T, decode?: TDecode, token?: string) => {
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
