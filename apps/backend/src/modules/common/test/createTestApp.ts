import Fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import type { IUser } from 'fitness-tracker-contracts';

import type { createAuthService } from '../../auth/service.js';
import type { createActivityService } from '../../activity/service.js';
import type { createUserService } from '../../user/service.js';
import type { createExerciseService } from '../../exercise/service.js';
import type { createEquipmentService } from '../../equipment/service.js';
import type { createMuscleService } from '../../muscle/service.js';
import { addSchemas } from '../addSchemas.js';
import { createAuthRoutes } from '../../auth/routes.js';
import { createActivityRoutes } from '../../activity/routes.js';
import { createUserRoutes } from '../../user/routes.js';
import { createExerciseRoutes } from '../../exercise/routes.js';
import { createEquipmentRoutes } from '../../equipment/routes.js';
import { createMuscleRoutes } from '../../muscle/routes.js';

const TEST_SECRET = 'test-secret';
const PREFIX = '/api';

interface TestAppServices {
  authService?: ReturnType<typeof createAuthService>;
  activityService?: ReturnType<typeof createActivityService>;
  userService?: ReturnType<typeof createUserService>;
  exerciseService?: ReturnType<typeof createExerciseService>;
  equipmentService?: ReturnType<typeof createEquipmentService>;
  muscleService?: ReturnType<typeof createMuscleService>;
}

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: IUser;
  }
  interface FastifyInstance {
    onlyUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    onlyAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function createTestApp(services: TestAppServices): Promise<FastifyInstance> {
  const fastify = Fastify();

  await fastify.register(jwt, { secret: TEST_SECRET });

  addSchemas(fastify);

  fastify.decorate('onlyUser', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.currentUser) {
      reply.code(403).send({ message: 'Auth error' });
    }
  });

  fastify.decorate('onlyAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.currentUser || request.currentUser.role !== 'admin') {
      reply.code(403).send({ message: 'Forbidden' });
    }
  });

  fastify.addHook('onRequest', async (request) => {
    try {
      request.currentUser = await request.jwtVerify<IUser>();
    } catch {
      request.currentUser = undefined;
    }
  });

  if (services.authService) {
    await fastify.register(createAuthRoutes({ authService: services.authService }), { prefix: PREFIX });
  }
  if (services.activityService) {
    await fastify.register(createActivityRoutes({ activityService: services.activityService }), { prefix: PREFIX });
  }
  if (services.userService) {
    await fastify.register(createUserRoutes({ userService: services.userService }), { prefix: PREFIX });
  }
  if (services.exerciseService) {
    await fastify.register(createExerciseRoutes({ exerciseService: services.exerciseService }), { prefix: PREFIX });
  }
  if (services.equipmentService) {
    await fastify.register(createEquipmentRoutes({ equipmentService: services.equipmentService }), { prefix: PREFIX });
  }
  if (services.muscleService) {
    await fastify.register(createMuscleRoutes({ muscleService: services.muscleService }), { prefix: PREFIX });
  }

  await fastify.ready();

  return fastify;
}

export function generateTestToken(fastify: FastifyInstance, user: IUser): string {
  return fastify.jwt.sign(user);
}
