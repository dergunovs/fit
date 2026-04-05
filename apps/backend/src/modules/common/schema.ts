import type { JSONSchemaType } from 'ajv';
import type { IPaginatedQuery, IBaseParams, IBaseReply, TPostUploadImageDTO } from 'fitness-tracker-contracts';

import type { ISchema } from './types.ts';

export const baseParams: JSONSchemaType<IBaseParams> = {
  $id: 'BaseParams',
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
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

export const uploadImageReply: JSONSchemaType<TPostUploadImageDTO> = {
  $id: 'UploadImageReply',
  type: 'object',
  properties: {
    url: { type: 'string' },
  },
  required: ['url'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const uploadImageSchema: ISchema = {
  schema: {
    tags: ['Upload'],
    summary: 'Загрузить изображение',
    response: { 201: uploadImageReply },
  },
};
