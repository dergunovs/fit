import type { FastifyInstance, FastifySchema, FastifyError } from 'fastify';
import { IUser } from 'fitness-tracker-contracts';

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
  createdBy?: IUser;
}

export interface IPopulate {
  path: string;
  select?: string | string[];
  populate?: IPopulate[];
}

export interface IAppError extends FastifyError {
  statusCode: number;
  code: string;
  message: string;
}
