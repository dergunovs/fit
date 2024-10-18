import bcrypt from 'bcryptjs';
import type { IUserToken, ILoginData } from 'fitness-tracker-contracts';

import User from '../models/user.js';

import { IAuthService } from '../interface/index.js';

export const authService: IAuthService = {
  check: async (request: { jwtVerify: () => Promise<void> }) => {
    await request.jwtVerify();
  },

  login: async (loginData: ILoginData, sign: (payload: IUserToken, options: object) => string) => {
    const { email, password } = loginData;

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser?.password) {
      return { user: undefined, isUserNotFound: true, isWrongPassword: false };
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) {
      return { user: undefined, isUserNotFound: false, isWrongPassword: true };
    }

    const user: IUserToken = {
      _id: foundUser._id,
      email: foundUser.email,
    };

    const token = sign(user, { expiresIn: '12h' });

    return { user: { ...user, token }, isUserNotFound: false, isWrongPassword: false };
  },

  setup: async (userToCreate: ILoginData) => {
    const users = await User.find().lean().exec();

    if (users.length) return true;

    const user = new User(userToCreate);

    if (!user.password) return true;

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    return false;
  },
};
