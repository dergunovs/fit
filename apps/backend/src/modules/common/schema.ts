import type { JSONSchemaType } from 'ajv';
import type { IPaginatedQuery, IBaseParams, IBaseReply } from 'fitness-tracker-contracts';

export const baseParams: JSONSchemaType<IBaseParams> = {
  $id: 'PaginatedParams',
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const paginatedQuery: JSONSchemaType<IPaginatedQuery> = {
  $id: 'PaginatedQuery',
  type: 'object',
  required: ['page'],
  properties: {
    page: { type: 'number' },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const baseReply: JSONSchemaType<IBaseReply> = {
  $id: 'BaseReply',
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};
