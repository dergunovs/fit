import bcrypt from 'bcryptjs';
import type { IAuthData, IRegisterData, IUser, TDecode, TLocale } from 'fitness-tracker-contracts';
import { generatePassword } from 'mhz-helpers';

import { sendMail } from '../common/helpers.ts';
import { error } from '../common/errorHandler.ts';
import { ACCESS_TOKEN_TTL, AUTH_TEXTS, BCRYPT_SALT_ROUNDS, CONFIRM_TOKEN_TTL } from './constants.ts';
import { decodeToken, filterUserData } from './helpers.ts';
import type { IAuthRepository } from './repository.ts';

export function createAuthService(deps: { authRepository: IAuthRepository }) {
  const { authRepository } = deps;

  return {
    check: async (verifiedUser: IUser) => {
      const user = await authRepository.findByEmail(verifiedUser.email);

      if (!user) throw error.notFound();

      return filterUserData(user);
    },

    login: async (loginData: IAuthData, sign: (payload: IUser, options: object) => string) => {
      const { email, password } = loginData;

      const user = await authRepository.findByEmailWithPassword(email);

      if (!user?.password) throw error.notFound();

      let isValid: boolean;

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

      if (!isValid) throw error.unauthorized();

      if (user.isEmailConfirmed === false && user.role !== 'admin') {
        throw error.unauthorized();
      }

      const token = sign(filterUserData(user, true), { expiresIn: ACCESS_TOKEN_TTL });

      user.dateLoggedIn = new Date();

      await authRepository.saveUser(user);

      return { user: filterUserData(user), token };
    },

    setup: async (adminToCreate: IAuthData) => {
      const usersCount = await authRepository.countUsers();

      if (usersCount > 0) throw error.conflict();

      const password = await bcrypt.hash(adminToCreate.password, BCRYPT_SALT_ROUNDS);

      await authRepository.createUser({ email: adminToCreate.email, password, isEmailConfirmed: true, role: 'admin' });
    },

    register: async (userToCreate: IRegisterData, lang: TLocale, sign: (payload: IUser, options: object) => string) => {
      const existingUser = await authRepository.countByEmail(userToCreate.email);

      if (existingUser > 0) throw error.conflict();

      const password = await bcrypt.hash(userToCreate.password, BCRYPT_SALT_ROUNDS);
      const confirmationToken = sign({ email: userToCreate.email }, { expiresIn: CONFIRM_TOKEN_TTL });

      await authRepository.createUser({
        email: userToCreate.email,
        name: userToCreate.name,
        password,
        confirmationToken,
        role: 'user',
      });

      const template = `${userToCreate.name}, ${AUTH_TEXTS.register[lang]} ${process.env.APP_URL}?token=${confirmationToken}`;

      await sendMail(template, userToCreate.email);
    },

    confirm: async (token: string, decode?: TDecode) => {
      const decodedUser = decodeToken(decode, `Bearer ${token}`);

      if (!decodedUser) throw error.badRequest();

      await authRepository.updateByEmail(
        { email: decodedUser.email, isEmailConfirmed: false, confirmationToken: token },
        { isEmailConfirmed: true, confirmationToken: '', dateUpdated: new Date() }
      );
    },

    reset: async (email: string, lang: TLocale) => {
      const user = await authRepository.findByEmail(email);

      if (!user) throw error.notFound();

      const newPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

      await authRepository.updateById(user._id, {
        passwordTemporary: hashedPassword,
        isResetPassword: true,
        dateUpdated: new Date(),
      });

      const template = `${user.name}, ${AUTH_TEXTS.reset[lang]}: ${newPassword}`;

      await sendMail(template, email);
    },
  };
}
