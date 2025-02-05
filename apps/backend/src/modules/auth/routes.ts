import {
  API_AUTH_CONFIRM,
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUTH_RESET,
  API_AUTH_SETUP,
} from 'fitness-tracker-contracts';
import type {
  IBaseReply,
  TGetAuthDTO,
  TPostAuthConfirmTokenDTO,
  TPostAuthConfirmTokenDataDTO,
  TPostAuthLoginDTO,
  TPostAuthLoginDataDTO,
  TPostAuthRegisterDTO,
  TPostAuthRegisterDataDTO,
  TPostAuthResetPasswordDTO,
  TPostAuthResetPasswordDataDTO,
  TPostAuthSetupDTO,
  TPostAuthSetupDataDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { authService } from './service.js';
import {
  authGetSchema,
  authLoginSchema,
  authSetupSchema,
  authRegisterSchema,
  authConfirmSchema,
  authResetSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  fastify.get<{ Reply: { 200: TGetAuthDTO; '4xx': IBaseReply } }>(
    API_AUTH_GET,
    { ...authGetSchema },
    async function (request, reply) {
      const { user, isUserNotFound } = await authService.check(request);

      if (isUserNotFound) {
        reply.code(404).send({ message: 'Пользователь не найден' });
      } else {
        reply.code(200).send(user);
      }
    }
  );

  fastify.post<{ Body: TPostAuthLoginDataDTO; Reply: { 200: TPostAuthLoginDTO; '4xx': IBaseReply } }>(
    API_AUTH_LOGIN,
    { ...authLoginSchema },
    async function (request, reply) {
      const { user, token, isUserNotFound, isWrongPassword, isEmailNotConfirmed } = await authService.login(
        request.body,
        fastify.jwt.sign
      );

      if (isUserNotFound) {
        reply.code(404).send({ message: 'Пользователь не найден' });
      } else if (isWrongPassword) {
        reply.code(401).send({ message: 'Неправильный пароль' });
      } else if (isEmailNotConfirmed) {
        reply.code(401).send({ message: 'Подтвердите email' });
      } else {
        reply.code(200).send({ user, token });
      }
    }
  );

  fastify.post<{ Body: TPostAuthSetupDataDTO; Reply: { 201: TPostAuthSetupDTO; '5xx': IBaseReply } }>(
    API_AUTH_SETUP,
    { ...authSetupSchema },
    async function (request, reply) {
      const isUsersExists = await authService.setup(request.body);

      if (isUsersExists) {
        reply.code(500).send({ message: 'Пользователи уже существуют' });
      } else {
        reply.code(201).send({ message: 'Пользователь создан' });
      }
    }
  );

  fastify.post<{ Body: TPostAuthRegisterDataDTO; Reply: { 201: TPostAuthRegisterDTO; '5xx': IBaseReply } }>(
    API_AUTH_REGISTER,
    { ...authRegisterSchema },
    async function (request, reply) {
      const isUserExists = await authService.register(request.body, fastify.jwt.sign);

      if (isUserExists) {
        reply.code(500).send({ message: 'Пользователь уже существует' });
      } else {
        reply.code(201).send({ message: 'Пользователь создан' });
      }
    }
  );

  fastify.post<{ Body: TPostAuthConfirmTokenDataDTO; Reply: { 200: TPostAuthConfirmTokenDTO; '5xx': IBaseReply } }>(
    API_AUTH_CONFIRM,
    { ...authConfirmSchema },
    async function (request, reply) {
      const isEmailNotConfirmed = await authService.confirm(request.body.token, fastify.jwt.decode);

      if (isEmailNotConfirmed) {
        reply.code(500).send({ message: 'Ошибка подтверждения почты' });
      } else {
        reply.code(200).send({ message: 'Почта подтверждена' });
      }
    }
  );

  fastify.post<{ Body: TPostAuthResetPasswordDataDTO; Reply: { 200: TPostAuthResetPasswordDTO; '5xx': IBaseReply } }>(
    API_AUTH_RESET,
    { ...authResetSchema },
    async function (request, reply) {
      const isUserNotExists = await authService.reset(request.body.email);

      if (isUserNotExists) {
        reply.code(500).send({ message: 'Пользователя с таким email не существует' });
      } else {
        reply.code(200).send({ message: 'Новый пароль установлен. Проверьте почту.' });
      }
    }
  );
}
