import type { FastifyInstance, FastifySchema } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser?: () => void;
  onlyAdmin?: () => void;
}

export interface ISchema {
  schema: FastifySchema;
}
