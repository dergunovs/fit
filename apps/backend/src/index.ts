import Fastify, { type FastifyError } from 'fastify';
import dotenv from 'dotenv';
import { Schema, connect } from 'mongoose';

import { addSchemas } from './modules/common/addSchemas.js';
import { registerPluginsAndRoutes } from './modules/common/registerPluginsAndRoutes.js';
import { errorHandler } from './modules/common/errorHandler.js';

dotenv.config({ quiet: true });

async function connectToDatabase() {
  const DATABASE_PATH = `mongodb://127.0.0.1/${process.env.DATABASE}`;

  Schema.Types.Boolean.convertToFalse.add('');

  try {
    await connect(DATABASE_PATH);
  } catch {
    process.exit(1);
  }
}

async function buildApp() {
  const fastify = Fastify({ logger: true });

  registerPluginsAndRoutes(fastify);
  addSchemas(fastify);

  fastify.setErrorHandler((error, _request, reply) => errorHandler(error as FastifyError, reply));

  return fastify;
}

async function startApp() {
  await connectToDatabase();

  const app = await buildApp();

  const port = Number(process.env.PORT);
  const host = 'localhost';

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

await startApp();
