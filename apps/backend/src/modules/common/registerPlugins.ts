import type { FastifyInstance } from 'fastify';

import corsPlugin from './plugins/cors.ts';
import helmetPlugin from './plugins/helmet.ts';
import jwtPlugin from './plugins/jwt.ts';
import ratePlugin from './plugins/rate.ts';
import swaggerPlugin from './plugins/swagger.ts';

const plugins = [corsPlugin, helmetPlugin, jwtPlugin, ratePlugin, swaggerPlugin];

export function registerPlugins(fastify: FastifyInstance) {
  plugins.forEach((plugin) => fastify.register(plugin));
}
