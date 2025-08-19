import bcrypt from 'bcryptjs';
import type { IAuthData, IRegisterData, IUser, TDecode } from 'fitness-tracker-contracts';

import User from '../user/model.js';
import { USER_POPULATE } from '../user/constants.js';
import { sendMail } from '../common/helpers.js';
import { decodeToken, filterUserData } from './helpers.js';

export const authService = {
  check: async (request: { jwtVerify: () => Promise<IUser> }) => {
    const verifiedUser = await request.jwtVerify();

    const user = await User.findOne({ email: verifiedUser.email }).populate(USER_POPULATE).lean();

    if (!user) throw new Error('User not found', { cause: { code: 404 } });

    return filterUserData(user);
  },

  login: async (loginData: IAuthData, sign: (payload: IUser, options: object) => string) => {
    const { email, password } = loginData;

    const user = await User.findOne({ email }).populate(USER_POPULATE);

    if (!user?.password) throw new Error('User not found', { cause: { code: 404 } });

    let isValid = false;

    if (user.isResetPassword && user.passwordTemporary) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        isValid = true;

        user.isResetPassword = false;
        user.passwordTemporary = '';
      } else {
        const isPasswordTemporaryValid = await bcrypt.compare(password, user.passwordTemporary);

        isValid = isPasswordTemporaryValid;
      }
    } else {
      isValid = await bcrypt.compare(password, user.password);
    }

    if (!isValid) throw new Error('Wrong password', { cause: { code: 401 } });

    if (user.isEmailConfirmed === false && user.role !== 'admin') {
      throw new Error('Email in not confirmed', { cause: { code: 401 } });
    }

    const token = sign(filterUserData(user, true), { expiresIn: '365d' });

    user.dateLoggedIn = new Date();

    await user.save();

    return { user: filterUserData(user), token };
  },

  setup: async (adminToCreate: IAuthData) => {
    const usersCount = await User.countDocuments();

    if (usersCount > 0) throw new Error('Users exists', { cause: { code: 500 } });

    const password = await bcrypt.hash(adminToCreate.password, 10);

    await User.create({ email: adminToCreate.email, password, isEmailConfirmed: true, role: 'admin' });
  },

  register: async (userToCreate: IRegisterData, lang: string, sign: (payload: IUser, options: object) => string) => {
    const existingUser = await User.countDocuments({ email: userToCreate.email });

    if (existingUser > 0) throw new Error('User exists', { cause: { code: 500 } });

    const password = await bcrypt.hash(userToCreate.password, 10);
    const confirmationToken = sign({ email: userToCreate.email }, { expiresIn: '24h' });

    await User.create({
      email: userToCreate.email,
      name: userToCreate.name,
      password,
      confirmationToken,
      role: 'user',
    });

    const text =
      lang === 'ru' ? 'для подтверждения регистрации перейдите по ссылке' : 'to confirm registration, follow the link';

    const template = `${userToCreate.name}, ${text} ${process.env.APP_URL}?token=${confirmationToken}`;

    await sendMail(template, userToCreate.email);
  },

  confirm: async (token: string, decode?: TDecode) => {
    const decodedUser = decodeToken(decode, `Bearer ${token}`);

    if (!decodedUser) throw new Error('Email is not confirmed', { cause: { code: 500 } });

    await User.updateOne(
      { email: decodedUser.email, isEmailConfirmed: false, confirmationToken: token },
      { $set: { isEmailConfirmed: true, confirmationToken: '', dateUpdated: new Date() } }
    );
  },
};
