import {
  API_EXERCISE,
  API_EXERCISE_ALL,
  API_EXERCISE_CUSTOM,
  type IBaseParams,
  type TGetExercisesDTO,
  type TGetExercisesQueryDTO,
  type TGetExerciseDTO,
  type TPostExerciseDTO,
  type TPostExerciseDataDTO,
  type TUpdateExerciseDTO,
  type TUpdateExerciseDataDTO,
  type TDeleteExerciseDTO,
  type TGetExercisesAllDTO,
  type TGetExercisesCustomDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { exerciseService } from './service.js';
import {
  exerciseGetManySchema,
  exerciseGetAllSchema,
  exerciseGetCustomSchema,
  exerciseGetOneSchema,
  exercisePostSchema,
  exerciseUpdateSchema,
  exerciseDeleteSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser || !fastify.onlyAdmin) return;

  fastify.get<{ Querystring: TGetExercisesQueryDTO; Reply: { 200: TGetExercisesDTO } }>(
    API_EXERCISE,
    { preValidation: [fastify.onlyAdmin], ...exerciseGetManySchema },
    async function (request, reply) {
      const data = await exerciseService.getMany(request.query.page);

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Reply: { 200: TGetExercisesAllDTO } }>(
    API_EXERCISE_ALL,
    { ...exerciseGetAllSchema },
    async function (request, reply) {
      const data = await exerciseService.getAll(fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Reply: { 200: TGetExercisesCustomDTO } }>(
    API_EXERCISE_CUSTOM,
    { ...exerciseGetCustomSchema },
    async function (request, reply) {
      const data = await exerciseService.getCustom(fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { ...exerciseGetOneSchema },
    async function (request, reply) {
      const data = await exerciseService.getOne(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostExerciseDataDTO; Reply: { 201: TPostExerciseDTO } }>(
    API_EXERCISE,
    {
      preValidation: [fastify.onlyUser],
      ...exercisePostSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 10000,
          errorResponseBuilder: (_req, context) => ({
            message: 'Too many attempts. Try again later.',
            code: 429,
            retryAfter: context.after,
          }),
        },
      },
    },
    async function (request, reply) {
      await exerciseService.create(request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(201).send({ message: 'Exercise added' });
    }
  );

  fastify.patch<{ Body: TUpdateExerciseDataDTO; Params: IBaseParams; Reply: { 200: TUpdateExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { preValidation: [fastify.onlyUser], ...exerciseUpdateSchema },
    async function (request, reply) {
      await exerciseService.update(request.params.id, request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ message: 'Exercise updated' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { preValidation: [fastify.onlyUser], ...exerciseDeleteSchema },
    async function (request, reply) {
      await exerciseService.delete(request.params.id, fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ message: 'Exercises deleted' });
    }
  );
}
