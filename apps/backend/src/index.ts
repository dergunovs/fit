import Fastify, { type FastifyError } from 'fastify';
import dotenv from 'dotenv';
import { Schema, connect } from 'mongoose';

import { addSchemas } from './modules/common/addSchemas.js';
import { registerPlugins } from './modules/common/registerPlugins.js';
import { createRoutes } from './modules/common/createRoutes.js';
import { errorHandler } from './modules/common/errorHandler.js';
import { DB_HOST, SERVER_HOST } from './modules/common/constants.js';

dotenv.config({ quiet: true });

async function connectToDatabase() {
  const DATABASE_PATH = `mongodb://${DB_HOST}/${process.env.DATABASE}`;

  Schema.Types.Boolean.convertToFalse.add('');

  try {
    await connect(DATABASE_PATH);
  } catch {
    process.exit(1);
  }
}

async function buildApp() {
  const isDev = process.env.IS_DEV === 'true';

  const fastify = Fastify({ logger: isDev, disableRequestLogging: !isDev });

  registerPlugins(fastify);
  createRoutes(fastify);
  addSchemas(fastify);

  fastify.setErrorHandler((error, _request, reply) => errorHandler(error as FastifyError, reply));

  return fastify;
}

async function startApp() {
  await connectToDatabase();

  const app = await buildApp();

  const port = Number(process.env.PORT);
  const host = SERVER_HOST;

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

await startApp();
