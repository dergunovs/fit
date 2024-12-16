import { API_USER } from 'fitness-tracker-contracts';
import type {
  IUser,
  IBaseParams,
  TGetUsersDTO,
  TGetUsersQueryDTO,
  TGetUserDTO,
  TPostUserDTO,
  TPostUserDataDTO,
  TUpdateUserDTO,
  TUpdateUserDataDTO,
  TDeleteUserDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { userService } from './service.js';
import { userPostSchema, userDeleteSchema, userGetManySchema, userGetOneSchema, userUpdateSchema } from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser) return;

  fastify.get<{ Querystring: TGetUsersQueryDTO; Reply: { 200: TGetUsersDTO } }>(
    API_USER,
    { preValidation: [fastify.onlyUser], ...userGetManySchema },
    async function (request, reply) {
      const { data, total } = await userService.getMany<IUser>(request.query.page);

      reply.code(200).send({ data, total });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser], ...userGetOneSchema },
    async function (request, reply) {
      const data = await userService.getOne<IUser>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostUserDataDTO; Reply: { 201: TPostUserDTO } }>(
    API_USER,
    { preValidation: [fastify.onlyUser], ...userPostSchema },
    async function (request, reply) {
      await userService.create<IUser>(request.body);

      reply.code(201).send({ message: 'Пользователь создан' });
    }
  );

  fastify.patch<{ Body: TUpdateUserDataDTO; Params: IBaseParams; Reply: { 200: TUpdateUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser], ...userUpdateSchema },
    async function (request, reply) {
      await userService.update<IUser>(request.params.id, request.body);

      reply.code(200).send({ message: 'Пользователь обновлен' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser], ...userDeleteSchema },
    async function (request, reply) {
      await userService.delete(request.params.id);

      reply.code(200).send({ message: 'Пользователь удален' });
    }
  );
}
