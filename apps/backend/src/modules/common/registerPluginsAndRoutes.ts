import type { FastifyInstance } from 'fastify';

import { createActivityRoutes } from '../activity/routes.js';
import { createAuthRoutes } from '../auth/routes.js';
import { createEquipmentRoutes } from '../equipment/routes.js';
import { createExerciseRoutes } from '../exercise/routes.js';
import { createMuscleRoutes } from '../muscle/routes.js';
import { createUserRoutes } from '../user/routes.js';
import { createAuthRepository } from '../auth/repository.js';
import { createUserRepository } from '../user/repository.js';
import { createActivityRepository } from '../activity/repository.js';
import { createExerciseRepository } from '../exercise/repository.js';
import { createEquipmentRepository } from '../equipment/repository.js';
import { createMuscleRepository } from '../muscle/repository.js';
import { createAuthService } from '../auth/service.js';
import { createUserService } from '../user/service.js';
import { createActivityService } from '../activity/service.js';
import { createExerciseService } from '../exercise/service.js';
import { createEquipmentService } from '../equipment/service.js';
import { createMuscleService } from '../muscle/service.js';

import corsPlugin from './plugins/cors.js';
import helmetPlugin from './plugins/helmet.js';
import jwtPlugin from './plugins/jwt.js';
import ratePlugin from './plugins/rate.js';
import swaggerPlugin from './plugins/swagger.js';

const plugins = [corsPlugin, helmetPlugin, jwtPlugin, ratePlugin, swaggerPlugin];

export function registerPluginsAndRoutes(fastify: FastifyInstance) {
  plugins.forEach((plugin) => fastify.register(plugin));

  const authRepository = createAuthRepository();
  const userRepository = createUserRepository();
  const activityRepository = createActivityRepository();
  const exerciseRepository = createExerciseRepository();
  const equipmentRepository = createEquipmentRepository();
  const muscleRepository = createMuscleRepository();

  const authService = createAuthService({ authRepository });
  const userService = createUserService({ userRepository });
  const activityService = createActivityService({
    activityRepository,
    userRepository,
    muscleRepository,
    exerciseRepository,
  });
  const exerciseService = createExerciseService({ exerciseRepository });
  const equipmentService = createEquipmentService({ equipmentRepository });
  const muscleService = createMuscleService({ muscleRepository });

  fastify.register(createAuthRoutes({ authService }), { prefix: '/api' });
  fastify.register(createUserRoutes({ userService }), { prefix: '/api' });
  fastify.register(createActivityRoutes({ activityService }), { prefix: '/api' });
  fastify.register(createExerciseRoutes({ exerciseService }), { prefix: '/api' });
  fastify.register(createEquipmentRoutes({ equipmentService }), { prefix: '/api' });
  fastify.register(createMuscleRoutes({ muscleService }), { prefix: '/api' });
}
