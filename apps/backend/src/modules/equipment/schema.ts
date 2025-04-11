import type { JSONSchemaType } from 'ajv';
import type { IEquipment, TGetEquipmentDTO, TGetEquipmentsDTO } from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { baseParams, baseReply } from '../common/schema.js';

const tags = ['Equipment'];

export const equipmentModel: JSONSchemaType<IEquipment> = {
  $id: 'Equipment',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    title: { type: 'string' },
    title_en: { type: 'string', nullable: true },
    isWeights: { type: 'boolean' },
  },
  required: ['title', 'isWeights'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const equipmentsReply: JSONSchemaType<TGetEquipmentsDTO> = {
  $id: 'EquipmentsReply',
  type: 'object',
  properties: {
    data: { type: 'array', items: equipmentModel },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const equipmentReply: JSONSchemaType<TGetEquipmentDTO> = {
  $id: 'EquipmentReply',
  type: 'object',
  properties: {
    data: { $ref: 'Equipment', nullable: true },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const equipmentGetAllSchema: ISchema = {
  schema: {
    tags,
    response: { 200: equipmentsReply },
  },
};

export const equipmentGetOneSchema: ISchema = {
  schema: {
    tags,
    response: { 200: equipmentReply },
    params: baseParams,
  },
};

export const equipmentPostSchema: ISchema = {
  schema: {
    tags,
    response: { 201: baseReply },
    body: equipmentModel,
    security: [{ token: [] }],
  },
};

export const equipmentUpdateSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: equipmentModel,
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const equipmentDeleteSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};
