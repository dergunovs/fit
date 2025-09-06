import type { FastifyInstance } from 'fastify';

import activityRoutes from '../activity/routes.js';
import authRoutes from '../auth/routes.js';
import equipmentRoutes from '../equipment/routes.js';
import exerciseRoutes from '../exercise/routes.js';
import muscleRoutes from '../muscle/routes.js';
import userRoutes from '../user/routes.js';

import corsPlugin from './plugins/cors.js';
import helmetPlugin from './plugins/helmet.js';
import jwtPlugin from './plugins/jwt.js';
import ratePlugin from './plugins/rate.js';
import swaggerPlugin from './plugins/swagger.js';

const plugins = [corsPlugin, helmetPlugin, jwtPlugin, ratePlugin, swaggerPlugin];
const routes = [activityRoutes, authRoutes, equipmentRoutes, exerciseRoutes, muscleRoutes, userRoutes];

export function registerPluginsAndRoutes(fastify: FastifyInstance) {
  plugins.forEach((plugin) => fastify.register(plugin));
  routes.forEach((route) => fastify.register(route, { prefix: '/api' }));
}
