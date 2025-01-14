import bcrypt from 'bcryptjs';
import type { IAuthData, IAuthService, IUser } from 'fitness-tracker-contracts';

import User from '../user/model.js';
import { filterUserData } from './helpers.js';

export const authService: IAuthService = {
  check: async (request: { jwtVerify: () => Promise<{ _doc: IUser }> }) => {
    const user = await request.jwtVerify();

    // eslint-disable-next-line no-underscore-dangle
    return filterUserData(user._doc);
  },

  login: async (loginData: IAuthData, sign: (payload: IUser, options: object) => string) => {
    const { email, password } = loginData;

    const user = await User.findOne({ email })
      .populate({ path: 'equipments', populate: { path: 'equipment' } })
      .exec();

    if (!user?.password) {
      return { user: undefined, isUserNotFound: true, isWrongPassword: false };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { user: undefined, isUserNotFound: false, isWrongPassword: true };
    }

    const token = sign(user, { expiresIn: '12h' });

    user.dateLoggedIn = new Date();

    await user.save();

    return { user: filterUserData(user), token, isUserNotFound: false, isWrongPassword: false };
  },

  setup: async (userToCreate: IAuthData) => {
    const users = await User.find().lean().exec();

    if (users.length) return true;

    const user = new User({ ...userToCreate, role: 'admin' });

    if (!user.password) return true;

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    return false;
  },
};
