import { API_AUTH_GET, API_AUTH_LOGIN, API_AUTH_SETUP } from 'fitness-tracker-contracts';
import type {
  ILoginData,
  IBaseReply,
  TGetAuthDTO,
  TPostAuthLoginDTO,
  TPostAuthSetupDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { authService } from './service.js';

export default async function (fastify: IFastifyInstance) {
  fastify.get<{ Reply: { 200: TGetAuthDTO } }>(API_AUTH_GET, async function (request, reply) {
    await authService.check(request);

    return reply.code(200).send({ message: 'Успешно авторизован' });
  });

  fastify.post<{ Body: ILoginData; Reply: { 200: TPostAuthLoginDTO; '4xx': IBaseReply } }>(
    API_AUTH_LOGIN,
    async function (request, reply) {
      const { user, isUserNotFound, isWrongPassword } = await authService.login(request.body, fastify.jwt.sign);

      if (isUserNotFound) {
        reply.code(404).send({ message: 'Пользователь не найден' });
      } else if (isWrongPassword) {
        reply.code(401).send({ message: 'Неправильный пароль' });
      } else {
        reply.code(200).send(user);
      }
    }
  );

  fastify.post<{ Body: ILoginData; Reply: { 201: TPostAuthSetupDTO; '5xx': IBaseReply } }>(
    API_AUTH_SETUP,
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
