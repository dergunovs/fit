import type { FastifyReply, FastifyError } from 'fastify';

import { IErrorCause, IStatusHandler } from './types.js';

const statusHandlers: IStatusHandler = {
  401: (reply, error) => reply.code(401).send({ message: error.message || 'Не авторизован' }),
  403: (reply, error) => reply.code(403).send({ message: error.message || 'Ошибка доступа' }),
  404: (reply, error) => reply.code(404).send({ message: error.message || 'Не найдено' }),
  422: (reply, error) => reply.code(422).send({ message: error.message || 'Ошибка валидации' }),
  500: (reply, error) => reply.code(500).send({ message: error.message || 'Ошибка сервера' }),
};

export function errorHandler(error: FastifyError, reply: FastifyReply) {
  const statusCode =
    error.cause && typeof error.cause === 'object' && 'code' in error.cause ? (error.cause as IErrorCause).code : 500;

  statusHandlers[statusCode](reply, error);
}
