import bcrypt from 'bcryptjs';
import type { IToken, IAuthData, IAuthService } from 'fitness-tracker-contracts';

import User from '../user/model.js';

export const authService: IAuthService = {
  check: async (request: { jwtVerify: () => Promise<IToken> }) => {
    const token = await request.jwtVerify();

    return token;
  },

  login: async (loginData: IAuthData, sign: (payload: IToken, options: object) => string) => {
    const { email, password } = loginData;

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser?.password) {
      return { user: undefined, isUserNotFound: true, isWrongPassword: false };
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);

    if (!isValidPassword) {
      return { user: undefined, isUserNotFound: false, isWrongPassword: true };
    }

    const userData: IToken = {
      _id: foundUser._id,
      email: foundUser.email,
      firstName: foundUser.firstName || '',
      lastName: foundUser.lastName || '',
      role: foundUser.role,
    };

    const token = sign(userData, { expiresIn: '12h' });

    const user = { ...userData, token };

    foundUser.dateLoggedIn = new Date();

    await foundUser.save();

    return { user, isUserNotFound: false, isWrongPassword: false };
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
