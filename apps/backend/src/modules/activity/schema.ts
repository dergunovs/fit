import type { JSONSchemaType } from 'ajv';
import type {
  IActivity,
  IActivityStatisticsValues,
  TGetActivitiesCalendarDTO,
  TGetActivitiesCalendarQueryDTO,
  TGetActivitiesChartDTO,
  TGetActivitiesChartQueryDTO,
  TGetActivitiesDTO,
  TGetActivitiesStatisticsDTO,
  TGetActivitiesStatisticsQueryDTO,
  TGetActivityDTO,
  TPostActivityDTO,
} from 'fitness-tracker-contracts';

import { ISchema } from '../common/types.js';
import { paginatedQuery, baseParams, baseReply } from '../common/schema.js';
import { exerciseDoneModel } from '../exercise/schema.js';

const tags = ['Activity'];

export const activityModel: JSONSchemaType<IActivity> = {
  $id: 'Activity',
  type: 'object',
  properties: {
    _id: { type: 'string', nullable: true },
    dateCreated: { type: 'string', format: 'date-time', nullable: true },
    dateUpdated: { type: 'string', format: 'date-time', nullable: true },
    exercises: { type: 'array', items: exerciseDoneModel },
    isDone: { type: 'boolean' },
    createdBy: { type: 'object', $ref: 'User', nullable: true },
  },
  required: ['exercises', 'isDone'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activityStatisticsValuesModel: JSONSchemaType<IActivityStatisticsValues> = {
  $id: 'ActivityStatisticsValues',
  type: 'object',
  properties: {
    cur: { type: 'number' },
    dynamics: { type: 'number' },
  },
  required: ['cur', 'dynamics'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesReply: JSONSchemaType<TGetActivitiesDTO> = {
  $id: 'ActivitiesReply',
  type: 'object',
  properties: {
    data: { type: 'array', items: activityModel },
    total: { type: 'number' },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesCalendarReply: JSONSchemaType<TGetActivitiesCalendarDTO> = {
  $id: 'ActivitiesCalendarReply',
  type: 'array',
  items: activityModel,
  $schema: 'http://json-schema.org/draft-07/schema#',
};

export const activitiesCalendarQuery: JSONSchemaType<TGetActivitiesCalendarQueryDTO> = {
  $id: 'ActivitiesCalendarQuery',
  type: 'object',
  properties: {
    dateFrom: { type: 'string' },
    dateTo: { type: 'string' },
  },
  required: ['dateFrom', 'dateTo'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesChartReply: JSONSchemaType<TGetActivitiesChartDTO> = {
  $id: 'ActivitiesChartReply',
  type: 'object',
  properties: {
    labels: { type: 'array', items: { type: 'string' } },
    datasets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'number' } },
          label: { type: 'string', nullable: true },
        },
        required: ['data'],
        additionalProperties: false,
      },
    },
  },
  required: ['labels', 'datasets'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesChartQuery: JSONSchemaType<TGetActivitiesChartQueryDTO> = {
  $id: 'ActivitiesChartQuery',
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['activity', 'set', 'repeat', 'group'] },
  },
  required: ['type'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesStatisticsReply: JSONSchemaType<TGetActivitiesStatisticsDTO> = {
  $id: 'ActivitiesStatisticsReply',
  type: 'object',
  properties: {
    activity: {
      type: 'object',
      properties: {
        activitiesCount: { type: 'object', $ref: 'ActivityStatisticsValues' },
        setsCount: { type: 'object', $ref: 'ActivityStatisticsValues' },
        repeatsCount: { type: 'object', $ref: 'ActivityStatisticsValues' },
        duration: { type: 'object', $ref: 'ActivityStatisticsValues' },
        averageSetsPerActivity: { type: 'object', $ref: 'ActivityStatisticsValues' },
        averageRepeatsPerSet: { type: 'object', $ref: 'ActivityStatisticsValues' },
        averageDuration: { type: 'object', $ref: 'ActivityStatisticsValues' },
        averageRestPercent: { type: 'object', $ref: 'ActivityStatisticsValues' },
      },
      required: [
        'activitiesCount',
        'averageDuration',
        'averageRepeatsPerSet',
        'averageRestPercent',
        'averageSetsPerActivity',
        'duration',
        'repeatsCount',
        'setsCount',
      ],
      additionalProperties: false,
    },
    exercise: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          sets: { type: 'number' },
          setsDynamics: { type: 'number' },
          repeats: { type: 'number' },
          repeatsDynamics: { type: 'number' },
          averageDuration: { type: 'number' },
          isUserEquipmentMatches: { type: 'boolean' },
        },
        required: [
          '_id',
          'averageDuration',
          'repeats',
          'repeatsDynamics',
          'sets',
          'setsDynamics',
          'title',
          'isUserEquipmentMatches',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['activity', 'exercise'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activitiesStatisticsQuery: JSONSchemaType<TGetActivitiesStatisticsQueryDTO> = {
  $id: 'ActivitiesStatisticsQuery',
  type: 'object',
  properties: {
    gap: { type: 'number' },
  },
  required: ['gap'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const activityReply: JSONSchemaType<TGetActivityDTO> = {
  $id: 'ActivityReply',
  type: 'object',
  properties: {
    data: { $ref: 'Activity' },
  },
  required: ['data'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
};

export const postActivityReply: JSONSchemaType<TPostActivityDTO> = {
  $id: 'PostActivityReply',
  type: 'string',
  $schema: 'http://json-schema.org/draft-07/schema#',
};

export const activityGetManySchema: ISchema = {
  schema: {
    tags,
    response: { 200: activitiesReply },
    querystring: paginatedQuery,
    security: [{ token: [] }],
  },
};

export const activityGetCalendarSchema: ISchema = {
  schema: {
    tags,
    response: { 200: activitiesCalendarReply },
    querystring: activitiesCalendarQuery,
  },
};

export const activityGetChartSchema: ISchema = {
  schema: {
    tags,
    response: { 200: activitiesChartReply },
    querystring: activitiesChartQuery,
  },
};

export const activityGetStatisticsSchema: ISchema = {
  schema: {
    tags,
    response: { 200: activitiesStatisticsReply },
    querystring: activitiesStatisticsQuery,
  },
};

export const activityGetOneSchema: ISchema = {
  schema: {
    tags,
    response: { 200: activityReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const activityGetLastSchema: ISchema = {
  schema: {
    tags,
    response: { 200: activityReply },
    security: [{ token: [] }],
  },
};

export const activityPostSchema: ISchema = {
  schema: {
    tags,
    response: { 201: postActivityReply },
    body: activityModel,
    security: [{ token: [] }],
  },
};

export const activityUpdateSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    body: activityModel,
    params: baseParams,
    security: [{ token: [] }],
  },
};

export const activityDeleteSchema: ISchema = {
  schema: {
    tags,
    response: { 200: baseReply },
    params: baseParams,
    security: [{ token: [] }],
  },
};
