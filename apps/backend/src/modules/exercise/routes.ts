import { API_EXERCISE } from 'fitness-tracker-contracts';
import type {
  IExercise,
  IBaseParams,
  TGetExercisesDTO,
  TGetExerciseDTO,
  TPostExerciseDTO,
  TUpdateExerciseDTO,
  TDeleteExerciseDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { exerciseService } from './service.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser) return;

  fastify.get<{ Reply: { 200: TGetExercisesDTO } }>(API_EXERCISE, async function (request, reply) {
    const data = await exerciseService.getAll();

    reply.code(200).send(data);
  });

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    async function (request, reply) {
      const data = await exerciseService.getOne<IExercise>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: IExercise; Reply: { 201: TPostExerciseDTO } }>(
    API_EXERCISE,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await exerciseService.create<IExercise>(request.body);

      reply.code(201).send({ message: 'Упражнение создано' });
    }
  );

  fastify.patch<{ Body: IExercise; Params: IBaseParams; Reply: { 200: TUpdateExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await exerciseService.update<IExercise>(request.params.id, request.body);

      reply.code(200).send({ message: 'Упражнение обновлено' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteExerciseDTO } }>(
    `${API_EXERCISE}/:id`,
    { preValidation: [fastify.onlyUser] },
    async function (request, reply) {
      await exerciseService.delete(request.params.id);

      reply.code(200).send({ message: 'Упражнение удалено' });
    }
  );
}
