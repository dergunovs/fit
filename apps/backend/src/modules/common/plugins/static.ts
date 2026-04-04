import fp from 'fastify-plugin';
import staticF from '@fastify/static';

export default fp(async function (fastify) {
  const root = process.env.UPLOAD_DIR;

  if (!root) return;

  fastify.register(staticF, { root: process.env.UPLOAD_DIR, prefix: '/upload' });
});
