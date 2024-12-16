import type { JSONSchemaType } from 'ajv';
import type { IAuthData, IToken, TGetAuthDTO } from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { baseReply } from '../common/schema.js';

const tags = ['Auth'];

export const tokenModel: JSONSchemaType<IToken> = {
  $id: 'Token',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    email: { type: 'string' },
    name: { type: 'string' },
    token: { type: 'string', nullable: true },
    role: { type: 'string', enum: ['user', 'admin'], nullable: true },
  },
  required: ['_id', 'email', 'name'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const authDataModel: JSONSchemaType<IAuthData> = {
  $id: 'AuthData',
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const authReply: JSONSchemaType<TGetAuthDTO> = {
  $id: 'AuthReply',
  type: 'object',
  $ref: 'Token',
  required: ['_id', 'email', 'name'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const authGetSchema: ISchema = {
  schema: {
    tags,
    response: { 200: authReply },
    security: [{ token: [] }],
  },
};

export const authLoginSchema: ISchema = {
  schema: {
    tags,
    body: authDataModel,
    response: { 200: authReply },
  },
};

export const authSetupSchema: ISchema = {
  schema: {
    tags,
    body: authDataModel,
    response: { 200: baseReply },
  },
};
