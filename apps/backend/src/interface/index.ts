import type { FastifyInstance, FastifySchema } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser: () => void;
}

export interface ISchema {
  schema: FastifySchema;
}
