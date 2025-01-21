import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { IUser } from 'fitness-tracker-contracts';

export default fp(async function (fastify) {
  const secret = process.env.SECRET;

  if (!secret) return;

  fastify.register(jwt, { secret });

  fastify.decorate('onlyUser', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error: unknown) {
      reply.code(403).send({ message: error || 'Ошибка аутентификации' });
    }
  });

  fastify.decorate('onlyAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await request.jwtVerify<IUser>();

      if (user.role !== 'admin') throw new Error();
    } catch (error: unknown) {
      reply.code(403).send({ message: error || 'Ошибка аутентификации' });
    }
  });
});
