import type { FastifyInstance } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser?: () => void;
}
