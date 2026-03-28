import type { FastifyInstance } from 'fastify';
import {
  API_USER,
  API_USER_FEEDBACK,
  API_USER_PASSWORD,
  type IBaseParams,
  type TGetUsersDTO,
  type TGetUsersQueryDTO,
  type TGetUserDTO,
  type TPostUserDTO,
  type TPostUserDataDTO,
  type TUpdateUserDTO,
  type TUpdateUserDataDTO,
  type TDeleteUserDTO,
  type TUpdateUserPasswordDTO,
  type TUpdateUserPasswordDataDTO,
  type TPostUserFeedbackDataDTO,
  type TPostUserFeedbackDTO,
} from 'fitness-tracker-contracts';

import { rateLimit } from '../common/helpers.js';
import { requireUser } from '../auth/helpers.js';
import type { createUserService } from './service.js';
import {
  userPostSchema,
  userDeleteSchema,
  userGetManySchema,
  userGetOneSchema,
  userUpdateSchema,
  userUpdatePasswordSchema,
  userPostFeedbackSchema,
} from './schema.js';

export function createUserRoutes(deps: { userService: ReturnType<typeof createUserService> }) {
  const { userService } = deps;

  return async function (fastify: FastifyInstance) {
    fastify.get<{ Querystring: TGetUsersQueryDTO; Reply: { 200: TGetUsersDTO } }>(
      API_USER,
      { preValidation: [fastify.onlyAdmin], ...userGetManySchema },
      async function (request, reply) {
        const data = await userService.getMany(request.query.page);

        reply.code(200).send(data);
      }
    );

    fastify.get<{ Params: IBaseParams; Reply: { 200: TGetUserDTO } }>(
      `${API_USER}/:id`,
      { preValidation: [fastify.onlyAdmin], ...userGetOneSchema },
      async function (request, reply) {
        const data = await userService.getOne(request.params.id);

        reply.code(200).send(data);
      }
    );

    fastify.post<{ Body: TPostUserDataDTO; Reply: { 201: TPostUserDTO } }>(
      API_USER,
      { preValidation: [fastify.onlyAdmin], ...userPostSchema },
      async function (request, reply) {
        await userService.create(request.body);

        reply.code(201).send({ message: 'User added' });
      }
    );

    fastify.post<{ Body: TPostUserFeedbackDataDTO; Reply: { 200: TPostUserFeedbackDTO } }>(
      API_USER_FEEDBACK,
      { ...userPostFeedbackSchema, config: { rateLimit } },
      async function (request, reply) {
        await userService.feedback(request.body);

        reply.code(200).send({ message: 'Feedback sended' });
      }
    );

    fastify.patch<{ Body: TUpdateUserDataDTO; Params: IBaseParams; Reply: { 200: TUpdateUserDTO } }>(
      `${API_USER}/:id`,
      { preValidation: [fastify.onlyUser], ...userUpdateSchema },
      async function (request, reply) {
        await userService.update(request.params.id, request.body, requireUser(request));

        reply.code(200).send({ message: 'User updated' });
      }
    );

    fastify.patch<{ Body: TUpdateUserPasswordDataDTO; Params: IBaseParams; Reply: { 200: TUpdateUserPasswordDTO } }>(
      `${API_USER_PASSWORD}/:id`,
      { preValidation: [fastify.onlyUser], ...userUpdatePasswordSchema },
      async function (request, reply) {
        await userService.updatePassword(request.params.id, request.body.password, requireUser(request));

        reply.code(200).send({ message: 'Users password updated' });
      }
    );

    fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteUserDTO } }>(
      `${API_USER}/:id`,
      { preValidation: [fastify.onlyUser], ...userDeleteSchema },
      async function (request, reply) {
        await userService.delete(request.params.id, requireUser(request));

        reply.code(200).send({ message: 'User deleted' });
      }
    );
  };
}
