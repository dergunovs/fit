import type { FastifyInstance, FastifySchema } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser?: () => void;
  onlyAdmin?: () => void;
}

export interface ISchema {
  schema: FastifySchema;
}

export interface IWeekDays {
  dateFrom: Date;
  dateTo: Date;
  label: string;
}
