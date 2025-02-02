import type { JSONSchemaType } from 'ajv';
import type { IAuthData, IRegisterData, TGetAuthDTO, TPostAuthLoginDTO } from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { baseReply } from '../common/schema.js';

const tags = ['Auth'];

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

export const registerDataModel: JSONSchemaType<IRegisterData> = {
  $id: 'RegisterData',
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['email', 'password', 'name'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const loginReply: JSONSchemaType<TPostAuthLoginDTO> = {
  $id: 'LoginReply',
  type: 'object',
  properties: {
    user: { type: 'object', $ref: 'User', nullable: true },
    token: { type: 'string', nullable: true },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const authReply: JSONSchemaType<TGetAuthDTO> = {
  $id: 'AuthReply',
  type: 'object',
  $ref: 'User',
  required: ['email'],
  nullable: true,
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
    response: { 200: loginReply },
  },
};

export const authSetupSchema: ISchema = {
  schema: {
    tags,
    body: authDataModel,
    response: { 200: baseReply },
  },
};

export const authRegisterSchema: ISchema = {
  schema: {
    tags,
    body: registerDataModel,
    response: { 200: baseReply },
  },
};
