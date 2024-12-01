import { API_USER } from 'fitness-tracker-contracts';
import type { IBaseReply, IUser, IBaseParams, IPaginatedReply, IPaginatedQuery } from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { userService } from './service.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser) return;

  fastify.get<{ Querystring: IPaginatedQuery; Reply: { 200: IPaginatedReply<IUser> } }>(
    API_USER,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      const { data, total } = await userService.getMany<IUser>(request.query.page);

      reply.code(200).send({ data, total });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: { data: IUser | null } } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      const data = await userService.getOne<IUser>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.patch<{ Body: IUser; Params: IBaseParams; Reply: { 200: IBaseReply } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await userService.update<IUser>(request.params.id, request.body);

      reply.code(200).send({ message: 'Пользователь обновлен' });
    }
  );

  fastify.post<{ Body: IUser; Reply: { 201: IBaseReply } }>(
    API_USER,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await userService.create<IUser>(request.body);

      reply.code(201).send({ message: 'Пользователь создан' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: IBaseReply } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await userService.delete(request.params.id);

      reply.code(200).send({ message: 'Пользователь удален' });
    }
  );
}
