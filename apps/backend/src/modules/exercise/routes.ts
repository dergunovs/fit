import { API_EXERCISE, API_EXERCISE_ALL, API_EXERCISE_CUSTOM } from 'fitness-tracker-contracts';
import type {
  IExercise,
  IBaseParams,
  TGetExercisesDTO,
  TGetExercisesQueryDTO,
  TGetExerciseDTO,
  TPostExerciseDTO,
  TPostExerciseDataDTO,
  TUpdateExerciseDTO,
  TUpdateExerciseDataDTO,
  TDeleteExerciseDTO,
  IBaseReply,
  TGetExercisesAllDTO,
  TGetExercisesCustomDTO,
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
      const { data, total } = await exerciseService.getMany<IExercise>(request.query.page);

      reply.code(200).send({ data, total });
    }
  );

  fastify.get<{ Reply: { 200: TGetExercisesAllDTO } }>(
    API_EXERCISE_ALL,
    { ...exerciseGetAllSchema },
    async function (request, reply) {
      const { data } = await exerciseService.getAll(fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ data });
    }
  );

  fastify.get<{ Reply: { 200: TGetExercisesCustomDTO } }>(
    API_EXERCISE_CUSTOM,
    { ...exerciseGetCustomSchema },
    async function (request, reply) {
      const { data } = await exerciseService.getCustom(fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ data });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { ...exerciseGetOneSchema },
    async function (request, reply) {
      const data = await exerciseService.getOne<IExercise>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostExerciseDataDTO; Reply: { 201: TPostExerciseDTO; 500: IBaseReply } }>(
    API_EXERCISE,
    { preValidation: [fastify.onlyUser], ...exercisePostSchema },
    async function (request, reply) {
      const isAllowToCreateExercise = await exerciseService.create<IExercise>(
        request.body,
        fastify.jwt.decode,
        request.headers.authorization
      );

      if (isAllowToCreateExercise) {
        reply.code(201).send({ message: 'Exercise added' });
      } else {
        reply.code(500).send({ message: 'Custom exercises limit error' });
      }
    }
  );

  fastify.patch<{ Body: TUpdateExerciseDataDTO; Params: IBaseParams; Reply: { 200: TUpdateExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { preValidation: [fastify.onlyUser], ...exerciseUpdateSchema },
    async function (request, reply) {
      await exerciseService.update<IExercise>(
        request.params.id,
        request.body,
        fastify.jwt.decode,
        request.headers.authorization
      );

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
