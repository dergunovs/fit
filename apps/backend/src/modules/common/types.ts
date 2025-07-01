import type { FastifyInstance, FastifySchema } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser?: () => void;
  onlyAdmin?: () => void;
}

export interface ISchema {
  schema: FastifySchema;
}

export interface IChartFilter {
  dateCreated: { $gte: Date; $lt: Date };
  isDone: boolean;
  createdBy: string | undefined;
}
