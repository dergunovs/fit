import type { JSONSchemaType } from 'ajv';
import type {
  IAuthData,
  IRegisterData,
  TGetAuthDTO,
  TPostAuthConfirmTokenDataDTO,
  TPostAuthLoginDTO,
  TPostAuthResetPasswordDataDTO,
} from 'fitness-tracker-contracts';

import type { ISchema } from '../common/types.ts';
import { baseReply } from '../common/schema.ts';

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

export const confirmTokenDataModel: JSONSchemaType<TPostAuthConfirmTokenDataDTO> = {
  $id: 'ConfirmTokenData',
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const resetPasswordDataModel: JSONSchemaType<TPostAuthResetPasswordDataDTO> = {
  $id: 'ResetPasswordData',
  type: 'object',
  properties: {
    email: { type: 'string' },
  },
  required: ['email'],
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
    summary: 'Получить текущего пользователя',
    response: { 200: authReply },
    security: [{ token: [] }],
  },
};

export const authLoginSchema: ISchema = {
  schema: {
    tags,
    summary: 'Авторизация',
    body: authDataModel,
    response: { 200: loginReply },
  },
};

export const authSetupSchema: ISchema = {
  schema: {
    tags,
    summary: 'Создание администратора',
    body: authDataModel,
    response: { 200: baseReply },
  },
};

export const authRegisterSchema: ISchema = {
  schema: {
    tags,
    summary: 'Регистрация пользователя',
    body: registerDataModel,
    response: { 200: baseReply },
  },
};

export const authConfirmSchema: ISchema = {
  schema: {
    tags,
    summary: 'Подтверждение email',
    body: confirmTokenDataModel,
    response: { 200: baseReply },
  },
};

export const authResetSchema: ISchema = {
  schema: {
    tags,
    summary: 'Сброс пароля',
    body: resetPasswordDataModel,
    response: { 200: baseReply },
  },
};
