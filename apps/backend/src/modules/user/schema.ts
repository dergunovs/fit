import type { JSONSchemaType } from 'ajv';
import type {
  IUser,
  IUserEquipment,
  TGetUserDTO,
  TGetUsersDTO,
  TUpdateUserPasswordDataDTO,
} from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { paginatedQuery, baseParams, baseReply } from '../common/schema.js';

const tags = ['User'];

export const userEquipmentModel: JSONSchemaType<IUserEquipment> = {
  $id: 'UserEquipment',
  type: 'object',
  properties: {
    equipment: { type: 'object', $ref: 'Equipment', nullable: true },
    weights: { type: 'array', items: { type: 'number' }, nullable: true },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const userPasswordModel: JSONSchemaType<TUpdateUserPasswordDataDTO> = {
  $id: 'UserPassword',
  type: 'object',
  properties: {
    password: { type: 'string' },
  },
  required: ['password'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const userModel: JSONSchemaType<IUser> = {
  $id: 'User',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    password: { type: 'string', nullable: true },
    passwordTemporary: { type: 'string', nullable: true },
    isResetPassword: { type: 'boolean', nullable: true },
    email: { type: 'string' },
    role: { type: 'string', enum: ['user', 'admin'], nullable: true },
    name: { type: 'string', nullable: true },
    dateLoggedIn: { type: 'string', format: 'date-time', nullable: true },
    isEmailConfirmed: { type: 'boolean', nullable: true },
    confirmationToken: { type: 'string', nullable: true },
    equipments: { type: 'array', items: userEquipmentModel, nullable: true },
    defaultWeights: { type: 'object', additionalProperties: { type: 'number' }, nullable: true, required: [] },
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

export const userUpdatePasswordSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: userPasswordModel,
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
