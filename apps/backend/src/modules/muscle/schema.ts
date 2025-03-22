import type { JSONSchemaType } from 'ajv';
import type { IMuscle, TGetMuscleDTO, TGetMusclesDTO } from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { baseParams, baseReply } from '../common/schema.js';

const tags = ['Muscle'];

export const muscleModel: JSONSchemaType<IMuscle> = {
  $id: 'Muscle',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    title: { type: 'string' },
    color: { type: 'string' },
  },
  required: ['title', 'color'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const musclesReply: JSONSchemaType<TGetMusclesDTO> = {
  $id: 'MusclesReply',
  type: 'object',
  properties: {
    data: { type: 'array', items: muscleModel },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const muscleReply: JSONSchemaType<TGetMuscleDTO> = {
  $id: 'MuscleReply',
  type: 'object',
  properties: {
    data: { $ref: 'Muscle', nullable: true },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const muscleGetAllSchema: ISchema = {
  schema: {
    tags,
    response: { 200: musclesReply },
  },
};

export const muscleGetOneSchema: ISchema = {
  schema: {
    tags,
    response: { 200: muscleReply },
    params: baseParams,
  },
};

export const musclePostSchema: ISchema = {
  schema: {
    tags,
    response: { 201: baseReply },
    body: muscleModel,
    security: [{ token: [] }],
  },
};

export const muscleUpdateSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: muscleModel,
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const muscleDeleteSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};
