import {
  API_ACTIVITY,
  API_ACTIVITY_CALENDAR,
  API_ACTIVITY_STATISTICS,
  API_ACTIVITY_CHART,
  type IBaseParams,
  type TGetActivitiesDTO,
  type TGetActivitiesQueryDTO,
  type TGetActivitiesCalendarDTO,
  type TGetActivitiesCalendarQueryDTO,
  type TGetActivitiesStatisticsDTO,
  type TGetActivitiesStatisticsQueryDTO,
  type TGetActivitiesChartDTO,
  type TGetActivitiesChartQueryDTO,
  type TGetActivityDTO,
  type TUpdateActivityDTO,
  type TUpdateActivityDataDTO,
  type TPostActivityDTO,
  type TPostActivityDataDTO,
  type TDeleteActivityDTO,
} from 'fitness-tracker-contracts';

import { IFastifyInstance } from '../common/types.js';
import { activityService } from './service.js';
import {
  activityDeleteSchema,
  activityGetCalendarSchema,
  activityGetChartSchema,
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
      const data = await activityService.getMany(request.query.page);

      reply.code(200).send(data);
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
      const data = await activityService.getChart(
        request.query.type,
        request.query.month,
        request.query.average,
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
      const data = await activityService.getOne(request.params.id, fastify.jwt.decode, request.headers.authorization);

      reply.code(200).send(data);
    }
  );

  fastify.post<{ Body: TPostActivityDataDTO; Reply: { 201: TPostActivityDTO } }>(
    API_ACTIVITY,
    { preValidation: [fastify.onlyUser], ...activityPostSchema },
    async function (request, reply) {
      const id = await activityService.create(request.body, fastify.jwt.decode, request.headers.authorization);

      reply.code(201).send(id);
    }
  );

  fastify.patch<{ Body: TUpdateActivityDataDTO; Params: IBaseParams; Reply: { 200: TUpdateActivityDTO } }>(
    `${API_ACTIVITY}/:id`,
    { preValidation: [fastify.onlyUser], ...activityUpdateSchema },
    async function (request, reply) {
      await activityService.update(request.params.id, request.body, fastify.jwt.decode, request.headers.authorization);

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
