import bcrypt from 'bcryptjs';
import type { IAuthData, IRegisterData, IAuthService, IUser } from 'fitness-tracker-contracts';

import User from '../user/model.js';
import { filterUserData } from './helpers.js';

export const authService: IAuthService = {
  check: async (request: { jwtVerify: () => Promise<IUser> }) => {
    const verifiedUser = await request.jwtVerify();

    const user = await User.findOne({ email: verifiedUser.email })
      .populate({ path: 'equipments', populate: { path: 'equipment' } })
      .lean()
      .exec();

    if (user) {
      return { user: filterUserData(user), isUserNotFound: false };
    } else {
      return { user: undefined, isUserNotFound: true };
    }
  },

  login: async (loginData: IAuthData, sign: (payload: IUser, options: object) => string) => {
    const { email, password } = loginData;

    const user = await User.findOne({ email })
      .populate({ path: 'equipments', populate: { path: 'equipment' } })
      .exec();

    if (!user?.password) {
      return { user: undefined, isUserNotFound: true, isWrongPassword: false, isEmailNotConfirmed: false };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { user: undefined, isUserNotFound: false, isWrongPassword: true, isEmailNotConfirmed: false };
    }

    if (user.isEmailConfirmed === false && user.role !== 'admin') {
      return { user: undefined, isUserNotFound: false, isWrongPassword: false, isEmailNotConfirmed: true };
    }

    const token = sign(filterUserData(user, true), { expiresIn: '12h' });

    user.dateLoggedIn = new Date();

    await user.save();

    return {
      user: filterUserData(user),
      token,
      isUserNotFound: false,
      isWrongPassword: false,
      isEmailNotConfirmed: false,
    };
  },

  setup: async (adminToCreate: IAuthData) => {
    const existingUsers = await User.find().lean().exec();

    if (existingUsers.length) return true;

    const password = await bcrypt.hash(adminToCreate.password, 10);
    const user = new User({ email: adminToCreate.email, password, isEmailConfirmed: true, role: 'admin' });

    await user.save();

    return false;
  },

  register: async (userToCreate: IRegisterData, sign: (payload: IUser, options: object) => string) => {
    const existingUser = await User.findOne({ email: userToCreate.email }).lean().exec();

    if (existingUser) return true;

    const password = await bcrypt.hash(userToCreate.password, 10);
    const confirmationToken = sign({ email: userToCreate.email }, { expiresIn: '24h' });

    const user = new User({
      email: userToCreate.email,
      name: userToCreate.name,
      password,
      confirmationToken,
      role: 'user',
    });

    await user.save();

    return false;
  },
};
