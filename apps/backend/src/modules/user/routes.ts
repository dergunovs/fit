import { API_USER, API_USER_FEEDBACK, API_USER_PASSWORD } from 'fitness-tracker-contracts';
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
  TUpdateUserPasswordDTO,
  TUpdateUserPasswordDataDTO,
  TPostUserFeedbackDataDTO,
  TPostUserFeedbackDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { userService } from './service.js';
import {
  userPostSchema,
  userDeleteSchema,
  userGetManySchema,
  userGetOneSchema,
  userUpdateSchema,
  userUpdatePasswordSchema,
  userPostFeedbackSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser || !fastify.onlyAdmin) return;

  fastify.get<{ Querystring: TGetUsersQueryDTO; Reply: { 200: TGetUsersDTO } }>(
    API_USER,
    { preValidation: [fastify.onlyAdmin], ...userGetManySchema },
    async function (request, reply) {
      const { data, total } = await userService.getMany<IUser>(request.query.page);

      reply.code(200).send({ data, total });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyAdmin], ...userGetOneSchema },
    async function (request, reply) {
      const data = await userService.getOne<IUser>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostUserDataDTO; Reply: { 201: TPostUserDTO } }>(
    API_USER,
    { preValidation: [fastify.onlyAdmin], ...userPostSchema },
    async function (request, reply) {
      await userService.create<IUser>(request.body);

      reply.code(201).send({ message: 'User added' });
    }
  );

  fastify.post<{ Body: TPostUserFeedbackDataDTO; Reply: { 200: TPostUserFeedbackDTO } }>(
    API_USER_FEEDBACK,
    { ...userPostFeedbackSchema },
    async function (request, reply) {
      await userService.feedback(request.body);

      reply.code(200).send({ message: 'Feedback sended' });
    }
  );

  fastify.patch<{ Body: TUpdateUserDataDTO; Params: IBaseParams; Reply: { 200: TUpdateUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser], ...userUpdateSchema },
    async function (request, reply) {
      await userService.update<IUser>(
        request.params.id,
        request.body,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send({ message: 'User updated' });
    }
  );

  fastify.patch<{ Body: TUpdateUserPasswordDataDTO; Params: IBaseParams; Reply: { 200: TUpdateUserPasswordDTO } }>(
    `${API_USER_PASSWORD}/:id`,
    { preValidation: [fastify.onlyUser], ...userUpdatePasswordSchema },
    async function (request, reply) {
      await userService.updatePassword(
        request.params.id,
        request.body.password,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send({ message: 'Users password updated' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteUserDTO } }>(
    `${API_USER}/:id`,
    { preValidation: [fastify.onlyUser], ...userDeleteSchema },
    async function (request, reply) {
      await userService.delete(request.params.id, fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ message: 'User deleted' });
    }
  );
}
