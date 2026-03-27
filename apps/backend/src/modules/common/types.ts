import type { FastifySchema, FastifyError } from 'fastify';
import { IUser } from 'fitness-tracker-contracts';

declare module 'fastify' {
  interface FastifyInstance {
    onlyUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    onlyAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export interface IAppError extends FastifyError {
  statusCode: number;
  code: string;
  message: string;
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
