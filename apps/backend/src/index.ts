import Fastify from 'fastify';
import dotenv from 'dotenv';
import { Schema, connect } from 'mongoose';

import { addSchemas } from './modules/common/addSchemas.js';
import { registerPluginsAndRoutes } from './modules/common/registerPluginsAndRoutes.js';
import { errorHandler } from './modules/common/errorHandler.js';

dotenv.config({ quiet: true });

function connectToDatabase() {
  Schema.Types.Boolean.convertToFalse.add('');
  connect(`mongodb://127.0.0.1/${process.env.DATABASE}`);
}

async function buildApp() {
  const fastify = Fastify({ logger: true });

  registerPluginsAndRoutes(fastify);
  addSchemas(fastify);

  fastify.setErrorHandler((error, request, reply) => errorHandler(error, reply));

  return fastify;
}

async function startApp() {
  connectToDatabase();

  const app = await buildApp();

  const port = Number(process.env.PORT);
  const host = 'localhost';

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startApp();
