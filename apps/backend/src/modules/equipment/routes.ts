import { API_EQUIPMENT } from 'fitness-tracker-contracts';
import type {
  IEquipment,
  IBaseParams,
  TGetEquipmentsDTO,
  TGetEquipmentDTO,
  TPostEquipmentDTO,
  TPostEquipmentDataDTO,
  TUpdateEquipmentDTO,
  TUpdateEquipmentDataDTO,
  TDeleteEquipmentDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { equipmentService } from './service.js';
import {
  equipmentDeleteSchema,
  equipmentGetAllSchema,
  equipmentGetOneSchema,
  equipmentPostSchema,
  equipmentUpdateSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser) return;

  fastify.get<{ Reply: { 200: TGetEquipmentsDTO } }>(
    API_EQUIPMENT,
    { ...equipmentGetAllSchema },
    async function (request, reply) {
      const { data } = await equipmentService.getAll();

      reply.code(200).send({ data });
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { ...equipmentGetOneSchema },
    async function (request, reply) {
      const data = await equipmentService.getOne<IEquipment>(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostEquipmentDataDTO; Reply: { 201: TPostEquipmentDTO } }>(
    API_EQUIPMENT,
    { preValidation: [fastify.onlyUser], ...equipmentPostSchema },
    async function (request, reply) {
      await equipmentService.create<IEquipment>(request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(201).send({ message: 'Оборудование создано' });
    }
  );

  fastify.patch<{ Body: TUpdateEquipmentDataDTO; Params: IBaseParams; Reply: { 200: TUpdateEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { preValidation: [fastify.onlyUser], ...equipmentUpdateSchema },
    async function (request, reply) {
      await equipmentService.update<IEquipment>(request.params.id, request.body);

      reply.code(200).send({ message: 'Оборудование обновлено' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { preValidation: [fastify.onlyUser], ...equipmentDeleteSchema },
    async function (request, reply) {
      await equipmentService.delete(request.params.id);

      reply.code(200).send({ message: 'Оборудование удалено' });
    }
  );
}
