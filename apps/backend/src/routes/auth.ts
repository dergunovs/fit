import { API_AUTH_CHECK, API_AUTH_LOGIN, API_AUTH_SETUP } from 'fitness-tracker-contracts';
import type { ILoginData, IUserToken, IBaseReply, ISignUpData } from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../interface/index.js';
import { authService } from '../services/auth.js';

export default async function (fastify: IFastifyInstance) {
  fastify.get<{ Reply: { 200: IBaseReply } }>(API_AUTH_CHECK, async function (request, reply) {
    await authService.check(request);

    return reply.code(200).send({ message: 'Auth checked' });
  });

  fastify.post<{ Body: ILoginData; Reply: { 200: IUserToken; '4xx': IBaseReply } }>(
    API_AUTH_LOGIN,
    async function (request, reply) {
      const { user, isUserNotFound, isWrongPassword } = await authService.login(request.body, fastify.jwt.sign);

      if (isUserNotFound) {
        reply.code(404).send({ message: 'User not found' });
      } else if (isWrongPassword) {
        reply.code(401).send({ message: 'Wrong password' });
      } else {
        reply.code(200).send(user);
      }
    }
  );

  fastify.post<{ Body: ISignUpData; Reply: { 201: IBaseReply; '5xx': IBaseReply } }>(
    API_AUTH_SETUP,
    async function (request, reply) {
      const isUserExists = await authService.setup(request.body);

      if (isUserExists) {
        reply.code(500).send({ message: 'User already exists' });
      } else {
        reply.code(201).send({ message: 'User created' });
      }
    }
  );
}
