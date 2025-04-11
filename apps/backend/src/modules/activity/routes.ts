import {
  API_ACTIVITY,
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_LAST,
  API_ACTIVITY_STATISTICS,
  API_ACTIVITY_CHART,
} from 'fitness-tracker-contracts';
import type {
  IBaseReply,
  IActivity,
  IBaseParams,
  TGetActivitiesDTO,
  TGetActivitiesQueryDTO,
  TGetActivitiesCalendarDTO,
  TGetActivitiesCalendarQueryDTO,
  TGetActivitiesStatisticsDTO,
  TGetActivitiesStatisticsQueryDTO,
  TGetActivitiesChartDTO,
  TGetActivitiesChartQueryDTO,
  TGetActivityDTO,
  TGetActivityLastDTO,
  TUpdateActivityDTO,
  TUpdateActivityDataDTO,
  TPostActivityDTO,
  TPostActivityDataDTO,
  TDeleteActivityDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { activityService } from './service.js';
import {
  activityDeleteSchema,
  activityGetCalendarSchema,
  activityGetChartSchema,
  activityGetLastSchema,
  activityGetManySchema,
  activityGetOneSchema,
  activityGetStatisticsSchema,
  activityPostSchema,
  activityUpdateSchema,
} from './schema.js';

export default async function (fastify: IFastifyInstance) {
  if (!fastify.onlyUser || !fastify.onlyAdmin) return;

  fastify.get<{ Querystring: TGetActivitiesQueryDTO; Reply: { 200: TGetActivitiesDTO } }>(
    API_ACTIVITY,
    { preValidation: [fastify.onlyAdmin], ...activityGetManySchema },
    async function (request, reply) {
      const { data, total } = await activityService.getMany<IActivity>(request.query.page);

      reply.code(200).send({ data, total });
    }
  );

  fastify.get<{ Querystring: TGetActivitiesCalendarQueryDTO; Reply: { 200: TGetActivitiesCalendarDTO } }>(
    API_ACTIVITY_CALENDAR,
    { ...activityGetCalendarSchema },
    async function (request, reply) {
      const data = await activityService.getCalendar(
        request.query.dateFrom,
        request.query.dateTo,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Querystring: TGetActivitiesStatisticsQueryDTO; Reply: { 200: TGetActivitiesStatisticsDTO } }>(
    API_ACTIVITY_STATISTICS,
    { ...activityGetStatisticsSchema },
    async function (request, reply) {
      const data = await activityService.getStatistics(
        request.query.gap,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Querystring: TGetActivitiesChartQueryDTO; Reply: { 200: TGetActivitiesChartDTO } }>(
    API_ACTIVITY_CHART,
    { ...activityGetChartSchema },
    async function (request, reply) {
      const data: TGetActivitiesChartDTO = await activityService.getChart(
        request.query.type,
        request.query.locale,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Params: IBaseParams; Reply: { 200: TGetActivityDTO } }>(
    `${API_ACTIVITY}/:id`,
    { preValidation: [fastify.onlyUser], ...activityGetOneSchema },
    async function (request, reply) {
      const data: TGetActivityDTO = await activityService.getOne<IActivity>(
        request.params.id,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send(data);
    }
  );

  fastify.get<{ Reply: { 200: TGetActivityLastDTO } }>(
    API_ACTIVITY_LAST,
    { preValidation: [fastify.onlyUser], ...activityGetLastSchema },
    async function (request, reply) {
      const data: TGetActivityLastDTO = await activityService.getLast<IActivity>(
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostActivityDataDTO; Reply: { 201: TPostActivityDTO; 500: IBaseReply } }>(
    API_ACTIVITY,
    { preValidation: [fastify.onlyUser], ...activityPostSchema },
    async function (request, reply) {
      const id = await activityService.create<IActivity>(
        request.body,
        fastify.jwt.decode,
        request.headers.authorization
      );

      if (id) {
        reply.code(201).send(id.toString());
      } else {
        reply.code(500).send({ message: 'Activity is not created' });
      }
    }
  );

  fastify.patch<{ Body: TUpdateActivityDataDTO; Params: IBaseParams; Reply: { 200: TUpdateActivityDTO } }>(
    `${API_ACTIVITY}/:id`,
    { preValidation: [fastify.onlyUser], ...activityUpdateSchema },
    async function (request, reply) {
      await activityService.update<IActivity>(
        request.params.id,
        request.body,
        fastify.jwt.decode,
        request.headers.authorization
      );

      reply.code(200).send({ message: 'Activity updated' });
    }
  );

  fastify.delete<{ Params: IBaseParams; Reply: { 200: TDeleteActivityDTO } }>(
    `${API_ACTIVITY}/:id`,
    { preValidation: [fastify.onlyUser], ...activityDeleteSchema },
    async function (request, reply) {
      await activityService.delete(request.params.id, fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send({ message: 'Activity deleted' });
    }
  );
}
