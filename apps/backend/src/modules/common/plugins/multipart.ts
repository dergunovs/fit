import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export default fp(async function (fastify) {
  fastify.register(multipart, { limits: { fieldSize: 10000000 } });
});
