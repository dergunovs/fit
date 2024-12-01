import type { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async function (fastify) {
  const secret = process.env.SECRET;

  if (!secret) return;

  fastify.register(jwt, { secret });

  fastify.decorate('onlyUser', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      reply.code(403).send({ message: 'Ошибка аутентификации' });
    }
  });
});
