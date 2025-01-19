import bcrypt from 'bcryptjs';
import type { IUser, IBaseService } from 'fitness-tracker-contracts';

import { paginate } from '../common/helpers.js';
import User from './model.js';

export const userService: IBaseService = {
  getMany: async <T>(page?: number) => {
    const { data, total } = await paginate(User, page, '-dateCreated', [{ path: 'equipments.equipment' }]);

    return { data: data as T[], total };
  },

  getOne: async <T>(_id: string) => {
    const user: IUser | null = await User.findOne({ _id })
      .select('_id name role email equipments defaultWeights')
      .populate({ path: 'equipments.equipment' })
      .lean()
      .exec();

    return { data: user as T };
  },

  create: async <T>(userToCreate: T) => {
    const user = new User(userToCreate);

    if (!user.password) return;

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
  },

  update: async <T>(_id: string, itemToUpdate: T) => {
    await User.findOneAndUpdate({ _id }, { ...itemToUpdate, dateUpdated: new Date() });
  },

  delete: async (_id?: string) => {
    const user = await User.findOne({ _id });

    await user?.deleteOne();
  },
};
