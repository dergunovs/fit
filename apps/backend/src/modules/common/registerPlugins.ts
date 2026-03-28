import type { FastifyInstance } from 'fastify';

import corsPlugin from './plugins/cors.js';
import helmetPlugin from './plugins/helmet.js';
import jwtPlugin from './plugins/jwt.js';
import ratePlugin from './plugins/rate.js';
import swaggerPlugin from './plugins/swagger.js';

const plugins = [corsPlugin, helmetPlugin, jwtPlugin, ratePlugin, swaggerPlugin];

export function registerPlugins(fastify: FastifyInstance) {
  plugins.forEach((plugin) => fastify.register(plugin));
}
