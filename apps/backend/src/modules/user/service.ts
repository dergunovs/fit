import bcrypt from 'bcryptjs';
import type { IUserFeedback, IUser, TDecode } from 'fitness-tracker-contracts';

import { checkInvalidId, sendMail } from '../common/helpers.js';
import { error } from '../common/errorHandler.js';
import { allowAccessToAdminAndCurrentUser } from '../auth/helpers.js';
import { BCRYPT_SALT_ROUNDS } from '../auth/constants.js';
import { userRepository } from './repository.js';

export const userService = {
  getMany: async (page?: number) => {
    const { data, total } = await userRepository.getMany(page);

    return { data, total };
  },

  getOne: async (_id: string) => {
    checkInvalidId(_id);

    const user = await userRepository.getOne(_id);

    if (!user) throw error.notFound();

    return { data: user };
  },

  create: async (userToCreate: IUser) => {
    if (!userToCreate.password) throw error.internal();

    userToCreate.password = await bcrypt.hash(userToCreate.password, BCRYPT_SALT_ROUNDS);

    await userRepository.create(userToCreate);
  },

  update: async (_id: string, itemToUpdate: IUser, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    await userRepository.updateOne(_id, itemToUpdate);
  },

  updatePassword: async (_id: string, password: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    const newPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await userRepository.updatePassword(_id, newPassword);
  },

  delete: async (_id: string, decode?: TDecode, token?: string) => {
    checkInvalidId(_id);

    allowAccessToAdminAndCurrentUser(_id, decode, token);

    await userRepository.deleteOne(_id);
  },

  feedback: async (feedback: IUserFeedback) => {
    const template = `Обратная связь от пользователя ${feedback.name} (${feedback.email}): ${feedback.message}`;

    await sendMail(template, `${process.env.EMAIL_USER}`);
  },
};
