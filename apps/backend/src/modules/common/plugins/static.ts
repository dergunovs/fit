import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import fp from 'fastify-plugin';
import staticF from '@fastify/static';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(dirname, '../../../../upload');

export default fp(async function (fastify) {
  await mkdir(uploadDir, { recursive: true });
  fastify.register(staticF, {
    root: uploadDir,
    prefix: '/upload',
  });
});
