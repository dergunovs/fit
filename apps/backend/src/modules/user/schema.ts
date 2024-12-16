import type { JSONSchemaType } from 'ajv';
import type { IUser, TGetUserDTO, TGetUsersDTO } from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { paginatedQuery, baseParams, baseReply } from '../common/schema.js';

const tags = ['User'];

export const userModel: JSONSchemaType<IUser> = {
  $id: 'User',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    password: { type: 'string', nullable: true },
    email: { type: 'string' },
    role: { type: 'string', enum: ['user', 'admin'] },
    name: { type: 'string', nullable: true },
    dateLoggedIn: { type: 'string', format: 'date-time', nullable: true },
  },
  required: ['email'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const usersReply: JSONSchemaType<TGetUsersDTO> = {
  $id: 'UsersReply',
  type: 'object',
  properties: {
    data: { type: 'array', items: userModel },
    total: { type: 'number' },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const userReply: JSONSchemaType<TGetUserDTO> = {
  $id: 'UserReply',
  type: 'object',
  properties: {
    data: { $ref: 'User' },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const userGetManySchema: ISchema = {
  schema: {
    tags,
    response: { 200: usersReply },
    querystring: paginatedQuery,
    security: [{ token: [] }],
  },
};

export const userGetOneSchema: ISchema = {
  schema: {
    tags,
    response: { 200: userReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const userPostSchema: ISchema = {
  schema: {
    tags,
    response: { 201: baseReply },
    body: userModel,
    security: [{ token: [] }],
  },
};

export const userUpdateSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: userModel,
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const userDeleteSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};
