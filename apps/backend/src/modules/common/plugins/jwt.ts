import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { IUser } from 'fitness-tracker-contracts';

import { error } from '../errorHandler.ts';

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: IUser;
  }
}

export default fp(async function (fastify) {
  const secret = process.env.SECRET;

  if (!secret) return;

  fastify.register(jwt, { secret });

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    try {
      request.currentUser = await request.jwtVerify<IUser>();
    } catch {
      request.currentUser = undefined;
    }
  });

  fastify.decorate('onlyUser', async function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.currentUser) {
      reply.code(403).send({ message: 'Auth error' });
    }
  });

  fastify.decorate('onlyAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.currentUser || request.currentUser.role !== 'admin') {
      reply.code(403).send({ message: error.forbidden().message });
    }
  });
});
