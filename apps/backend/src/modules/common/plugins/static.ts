import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import fp from 'fastify-plugin';
import staticF from '@fastify/static';

const uploadDir = path.join(process.cwd(), 'upload');

export default fp(async function (fastify) {
  await mkdir(uploadDir, { recursive: true });
  fastify.register(staticF, { root: uploadDir, prefix: '/upload' });
});
