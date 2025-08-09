import {
  API_AUTH_CONFIRM,
  API_AUTH_GET,
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUTH_RESET,
  API_AUTH_SETUP,
} from 'fitness-tracker-contracts';
import type {
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
  fastify.get<{ Reply: { 200: TGetAuthDTO } }>(API_AUTH_GET, { ...authGetSchema }, async function (request, reply) {
    const user = await authService.check(request);

    reply.code(200).send(user);
  });

  fastify.post<{ Body: TPostAuthLoginDataDTO; Reply: { 200: TPostAuthLoginDTO } }>(
    API_AUTH_LOGIN,
    { ...authLoginSchema },
    async function (request, reply) {
      const data = await authService.login(request.body, fastify.jwt.sign);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostAuthSetupDataDTO; Reply: { 201: TPostAuthSetupDTO } }>(
    API_AUTH_SETUP,
    { ...authSetupSchema },
    async function (request, reply) {
      await authService.setup(request.body);

      reply.code(201).send({ message: 'Administrator created' });
    }
  );

  fastify.post<{
    Body: TPostAuthRegisterDataDTO;
    Querystring: TPostAuthRegisterQueryDTO;
    Reply: { 201: TPostAuthRegisterDTO };
  }>(API_AUTH_REGISTER, { ...authRegisterSchema }, async function (request, reply) {
    await authService.register(request.body, request.query.lang, fastify.jwt.sign);

    reply.code(201).send({ message: 'User created' });
  });

  fastify.post<{ Body: TPostAuthConfirmTokenDataDTO; Reply: { 200: TPostAuthConfirmTokenDTO } }>(
    API_AUTH_CONFIRM,
    { ...authConfirmSchema },
    async function (request, reply) {
      await authService.confirm(request.body.token, fastify.jwt.decode);

      reply.code(200).send({ message: 'Email confirmed' });
    }
  );

  fastify.post<{
    Body: TPostAuthResetPasswordDataDTO;
    Querystring: TPostAuthResetPasswordQueryDTO;
    Reply: { 200: TPostAuthResetPasswordDTO };
  }>(API_AUTH_RESET, { ...authResetSchema }, async function (request, reply) {
    await authService.reset(request.body.email, request.query.lang);

    reply.code(200).send({ message: 'Password reseted' });
  });
}
