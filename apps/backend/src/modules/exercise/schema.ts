import type { JSONSchemaType } from 'ajv';
import type { IExercise, IExerciseDone, TGetExerciseDTO, TGetExercisesDTO } from 'fitness-tracker-contracts';

import { muscleModel } from '../muscle/schema.js';
import { ISchema } from '../common/types.js';
import { baseParams, baseReply } from '../common/schema.js';

const tags = ['Exercise'];

export const exerciseModel: JSONSchemaType<IExercise> = {
  $id: 'Exercise',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    createdBy: { type: 'object', $ref: 'User', nullable: true },
    muscles: { type: 'array', items: muscleModel, nullable: true },
    isWeights: { type: 'boolean' },
    isWeightsRequired: { type: 'boolean' },
    equipment: { type: 'object', $ref: 'Equipment', required: ['title', 'isWeights'], nullable: true },
    equipmentForWeight: {
      type: 'array',
      items: { type: 'object', $ref: 'Equipment', required: ['title', 'isWeights'] },
      nullable: true,
    },
  },
  required: ['title'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const exerciseDoneModel: JSONSchemaType<IExerciseDone> = {
  $id: 'ExerciseDone',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    exercise: { type: 'object', $ref: 'Exercise', nullable: true },
    repeats: { type: 'number' },
    weight: { type: 'number', nullable: true },
    isToFailure: { type: 'boolean', nullable: true },
    duration: { type: 'number', nullable: true },
    isDone: { type: 'boolean', nullable: true },
  },
  required: ['repeats'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const exercisesReply: JSONSchemaType<TGetExercisesDTO> = {
  $id: 'ExercisesReply',
  type: 'object',
  properties: {
    data: { type: 'array', items: exerciseModel },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const exerciseReply: JSONSchemaType<TGetExerciseDTO> = {
  $id: 'ExerciseReply',
  type: 'object',
  properties: {
    data: { $ref: 'Exercise', nullable: true },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const exerciseGetAllSchema: ISchema = {
  schema: {
    tags,
    response: { 200: exercisesReply },
  },
};

export const exerciseGetOneSchema: ISchema = {
  schema: {
    tags,
    response: { 200: exerciseReply },
    params: baseParams,
  },
};

export const exercisePostSchema: ISchema = {
  schema: {
    tags,
    response: { 201: baseReply },
    body: exerciseModel,
    security: [{ token: [] }],
  },
};

export const exerciseUpdateSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: exerciseModel,
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const exerciseDeleteSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};
