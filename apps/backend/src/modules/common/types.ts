import type { FastifyInstance } from 'fastify';

export interface IFastifyInstance extends FastifyInstance {
  onlyUser?: () => void;
}

export interface IWeekDays {
  dateFrom: Date;
  dateTo: Date;
  label: string;
}
