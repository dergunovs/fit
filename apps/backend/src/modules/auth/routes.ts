import { API_AUTH_GET, API_AUTH_LOGIN, API_AUTH_SETUP } from 'fitness-tracker-contracts';
import type {
  IBaseReply,
  TGetAuthDTO,
  TPostAuthLoginDTO,
  TPostAuthLoginDataDTO,
  TPostAuthSetupDTO,
  TPostAuthSetupDataDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { authService } from './service.js';
import { authGetSchema, authLoginSchema, authSetupSchema } from './schema.js';

export default async function (fastify: IFastifyInstance) {
  fastify.get<{ Reply: { 200: TGetAuthDTO } }>(API_AUTH_GET, { ...authGetSchema }, async function (request, reply) {
    const user = await authService.check(request);

    return reply.code(200).send(user);
  });

  fastify.post<{ Body: TPostAuthLoginDataDTO; Reply: { 200: TPostAuthLoginDTO; '4xx': IBaseReply } }>(
    API_AUTH_LOGIN,
    { ...authLoginSchema },
    async function (request, reply) {
      const { user, token, isUserNotFound, isWrongPassword } = await authService.login(request.body, fastify.jwt.sign);

      if (isUserNotFound) {
        reply.code(404).send({ message: 'Пользователь не найден' });
      } else if (isWrongPassword) {
        reply.code(401).send({ message: 'Неправильный пароль' });
      } else {
        reply.code(200).send({ user, token });
      }
    }
  );

  fastify.post<{ Body: TPostAuthSetupDataDTO; Reply: { 201: TPostAuthSetupDTO; '5xx': IBaseReply } }>(
    API_AUTH_SETUP,
    { ...authSetupSchema },
    async function (request, reply) {
      const isUserExists = await authService.setup(request.body);

      if (isUserExists) {
        reply.code(500).send({ message: 'Пользователи уже существуют' });
      } else {
        reply.code(201).send({ message: 'Пользователь создан' });
      }
    }
  );
}
