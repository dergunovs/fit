import bcrypt from 'bcryptjs';
import type { IAuthData, IRegisterData, IAuthService, IUser, TDecode } from 'fitness-tracker-contracts';

import User from '../user/model.js';
import { sendMail } from '../common/helpers.js';
import { decodeToken, filterUserData, generatePassword } from './helpers.js';

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

    if (!isValid) {
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

    const template = `${userToCreate.name}, для подтверждения регистрации перейдите по ссылке ${process.env.APP_URL}?token=${confirmationToken}`;

    await sendMail(template, userToCreate.email);

    return false;
  },

  confirm: async (token: string, decode?: TDecode) => {
    const decodedUser = decodeToken(decode, `Bearer ${token}`);

    if (!decodedUser) return true;

    const user = await User.findOne({ email: decodedUser.email });

    if (!user || user.isEmailConfirmed || token !== user.confirmationToken) return true;

    await user.updateOne({ isEmailConfirmed: true, confirmationToken: '', dateUpdated: new Date() });

    await user.save();

    return false;
  },

  reset: async (email: string) => {
    const user = await User.findOne({ email });

    if (!user || !user.isEmailConfirmed) return true;

    const newPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.updateOne({ passwordTemporary: hashedPassword, isResetPassword: true, dateUpdated: new Date() });

    await user.save();

    const template = `${user.name}, войдите в приложение с новым паролем. Если вы не отправляли заявку на смену пароля, то используйте свой текущий пароль. Новый пароль: ${newPassword}`;

    await sendMail(template, email);

    return false;
  },
};
