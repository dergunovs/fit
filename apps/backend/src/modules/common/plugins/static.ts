import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fp from 'fastify-plugin';
import staticF from '@fastify/static';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default fp(async function (fastify) {
  fastify.register(staticF, {
    root: path.join(dirname, '../../../../upload'),
    prefix: '/upload',
  });
});
