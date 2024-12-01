import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async function (fastify) {
  fastify.register(rateLimit, { max: 500, timeWindow: 20000 });
});
