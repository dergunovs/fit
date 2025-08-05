import type { FastifyInstance, FastifySchema, FastifyError, FastifyReply } from 'fastify';

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

export interface IErrorCause {
  code: number;
}

export interface IStatusHandler {
  [key: number]: (reply: FastifyReply, error: FastifyError) => void;
}

export interface IPopulate {
  path: string;
  select?: string | string[];
  populate?: IPopulate[];
}
