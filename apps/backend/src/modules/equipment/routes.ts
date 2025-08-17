import {
  API_EQUIPMENT,
  type IBaseParams,
  type TGetEquipmentsDTO,
  type TGetEquipmentDTO,
  type TPostEquipmentDTO,
  type TPostEquipmentDataDTO,
  type TUpdateEquipmentDTO,
  type TUpdateEquipmentDataDTO,
  type TDeleteEquipmentDTO,
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
  if (!fastify.onlyUser || !fastify.onlyAdmin) return;

  fastify.get<{ Reply: { 200: TGetEquipmentsDTO } }>(
    API_EQUIPMENT,
    { ...equipmentGetAllSchema },
    async function (_request, reply) {
      const data = await equipmentService.getAll();

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { ...equipmentGetOneSchema },
    async function (request, reply) {
      const data = await equipmentService.getOne(request.params.id);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostEquipmentDataDTO; Reply: { 201: TPostEquipmentDTO } }>(
    API_EQUIPMENT,
    { preValidation: [fastify.onlyAdmin], ...equipmentPostSchema },
    async function (request, reply) {
      await equipmentService.create(request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(201).send({ message: 'Equipment added' });
    }
  );

  fastify.patch<{ Body: TUpdateEquipmentDataDTO; Params: IBaseParams; Reply: { 200: TUpdateEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { preValidation: [fastify.onlyAdmin], ...equipmentUpdateSchema },
    async function (request, reply) {
      await equipmentService.update(request.params.id, request.body);

      reply.code(200).send({ message: 'Equipment updated' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteEquipmentDTO } }>(
    `${API_EQUIPMENT}/:id`,
    { preValidation: [fastify.onlyAdmin], ...equipmentDeleteSchema },
    async function (request, reply) {
      await equipmentService.delete(request.params.id);

      reply.code(200).send({ message: 'Equipment deleted' });
    }
  );
}
