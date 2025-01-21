import Fastify from 'fastify';
import dotenv from 'dotenv';
import { Schema, connect } from 'mongoose';

import corsPlugin from './modules/common/plugins/cors.js';
import helmetPlugin from './modules/common/plugins/helmet.js';
import jwtPlugin from './modules/common/plugins/jwt.js';
import ratePlugin from './modules/common/plugins/rate.js';
import swaggerPlugin from './modules/common/plugins/swagger.js';

import activityRoutes from './modules/activity/routes.js';
import authRoutes from './modules/auth/routes.js';
import exerciseRoutes from './modules/exercise/routes.js';
import userRoutes from './modules/user/routes.js';
import equipmentRoutes from './modules/equipment/routes.js';

import { addSchemas } from './modules/common/addSchemas.js';

dotenv.config();

function connectToDatabase() {
  Schema.Types.Boolean.convertToFalse.add('');
  connect(`mongodb://127.0.0.1/${process.env.DATABASE}`);
}

async function buildApp() {
  const fastify = Fastify({ logger: true });

  fastify.register(corsPlugin);
  fastify.register(helmetPlugin);
  fastify.register(jwtPlugin);
  fastify.register(ratePlugin);
  fastify.register(swaggerPlugin);

  fastify.register(activityRoutes, { prefix: '/api' });
  fastify.register(authRoutes, { prefix: '/api' });
  fastify.register(exerciseRoutes, { prefix: '/api' });
  fastify.register(userRoutes, { prefix: '/api' });
  fastify.register(equipmentRoutes, { prefix: '/api' });

  addSchemas(fastify);

  fastify.setErrorHandler(function (error, request, reply) {
    if (error.cause && (error.cause as { code: number }).code === 403) {
      reply.code(403).send({ message: error.message });
    } else {
      reply.code(500).send({ message: error.message || 'Server error' });
    }
  });

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
