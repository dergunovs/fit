import { API_MUSCLE } from 'fitness-tracker-contracts';
import type {
  IMuscle,
  IBaseParams,
  TGetMusclesDTO,
  TGetMuscleDTO,
  TPostMuscleDTO,
  TPostMuscleDataDTO,
  TUpdateMuscleDTO,
  TUpdateMuscleDataDTO,
  TDeleteMuscleDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { muscleService } from './service.js';
import {
  muscleDeleteSchema,
  muscleGetAllSchema,
  muscleGetOneSchema,
  musclePostSchema,
  muscleUpdateSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser || !fastify.onlyAdmin) return;

  fastify.get<{ Reply: { 200: TGetMusclesDTO } }>(
    API_MUSCLE,
    { ...muscleGetAllSchema },
    async function (_request, reply) {
      const { data } = await muscleService.getAll();

      reply.code(200).send({ data });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetMuscleDTO } }>(
    `${API_MUSCLE}/:id`,
    { ...muscleGetOneSchema },
    async function (request, reply) {
      const data = await muscleService.getOne<IMuscle>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostMuscleDataDTO; Reply: { 201: TPostMuscleDTO } }>(
    API_MUSCLE,
    { preValidation: [fastify.onlyAdmin], ...musclePostSchema },
    async function (request, reply) {
      await muscleService.create<IMuscle>(request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(201).send({ message: 'Muscle groud added' });
    }
  );

  fastify.patch<{ Body: TUpdateMuscleDataDTO; Params: IBaseParams; Reply: { 200: TUpdateMuscleDTO } }>(
    `${API_MUSCLE}/:id`,
    { preValidation: [fastify.onlyAdmin], ...muscleUpdateSchema },
    async function (request, reply) {
      await muscleService.update<IMuscle>(request.params.id, request.body);

      reply.code(200).send({ message: 'Muscle groud updated' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteMuscleDTO } }>(
    `${API_MUSCLE}/:id`,
    { preValidation: [fastify.onlyAdmin], ...muscleDeleteSchema },
    async function (request, reply) {
      await muscleService.delete(request.params.id);

      reply.code(200).send({ message: 'Muscle groud updated' });
    }
  );
}
