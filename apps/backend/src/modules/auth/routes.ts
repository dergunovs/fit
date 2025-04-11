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
  TPostAuthRegisterQueryDTO,
  TPostAuthResetPasswordDTO,
  TPostAuthResetPasswordDataDTO,
  TPostAuthResetPasswordQueryDTO,
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
        reply.code(404).send({ message: 'User not found' });
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
        reply.code(404).send({ message: 'User not found' });
      } else if (isWrongPassword) {
        reply.code(401).send({ message: 'Wrong password' });
      } else if (isEmailNotConfirmed) {
        reply.code(401).send({ message: 'Email is not confirmed' });
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
        reply.code(500).send({ message: 'User does not exist' });
      } else {
        reply.code(201).send({ message: 'User created' });
      }
    }
  );

  fastify.post<{
    Body: TPostAuthRegisterDataDTO;
    Querystring: TPostAuthRegisterQueryDTO;
    Reply: { 201: TPostAuthRegisterDTO; '5xx': IBaseReply };
  }>(API_AUTH_REGISTER, { ...authRegisterSchema }, async function (request, reply) {
    const isUserExists = await authService.register(request.body, request.query.lang, fastify.jwt.sign);

    if (isUserExists) {
      reply.code(500).send({ message: 'User exists' });
    } else {
      reply.code(201).send({ message: 'User added' });
    }
  });

  fastify.post<{ Body: TPostAuthConfirmTokenDataDTO; Reply: { 200: TPostAuthConfirmTokenDTO; '5xx': IBaseReply } }>(
    API_AUTH_CONFIRM,
    { ...authConfirmSchema },
    async function (request, reply) {
      const isEmailNotConfirmed = await authService.confirm(request.body.token, fastify.jwt.decode);

      if (isEmailNotConfirmed) {
        reply.code(500).send({ message: 'Email is not confirmed' });
      } else {
        reply.code(200).send({ message: 'Email confirmed' });
      }
    }
  );

  fastify.post<{
    Body: TPostAuthResetPasswordDataDTO;
    Querystring: TPostAuthResetPasswordQueryDTO;
    Reply: { 200: TPostAuthResetPasswordDTO; '5xx': IBaseReply };
  }>(API_AUTH_RESET, { ...authResetSchema }, async function (request, reply) {
    const isUserNotExists = await authService.reset(request.body.email, request.query.lang);

    if (isUserNotExists) {
      reply.code(500).send({ message: 'User does not exist' });
    } else {
      reply.code(200).send({ message: 'Check email' });
    }
  });
}
