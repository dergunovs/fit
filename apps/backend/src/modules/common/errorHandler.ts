import type { FastifyReply, FastifyError } from 'fastify';

import type { IAppError } from './types.ts';

function createError(message: string, statusCode: number, code: string): IAppError {
  const error = new Error(message) as IAppError;

  error.statusCode = statusCode;
  error.code = code;

  return error;
}

export const error = {
  notFound: () => createError('Not found', 404, 'NOT_FOUND'),
  unauthorized: () => createError('Unauthorized', 401, 'UNAUTHORIZED'),
  forbidden: () => createError('Access denied', 403, 'FORBIDDEN'),
  validation: () => createError('Validation error', 422, 'VALIDATION_ERROR'),
  conflict: () => createError('Already exists', 409, 'CONFLICT'),
  badRequest: () => createError('Bad request', 400, 'BAD_REQUEST'),
  internal: () => createError('Internal server error', 500, 'INTERNAL_ERROR'),
};

export function errorHandler(err: FastifyError, reply: FastifyReply) {
  const appError = err as unknown as IAppError;
  const statusCode = appError.statusCode || 500;
  const code = appError.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  reply.code(statusCode).send({ message, code });
}
