import type { FastifyInstance } from 'fastify';

import { createActivityRoutes } from '../activity/routes.ts';
import { createAuthRoutes } from '../auth/routes.ts';
import { createEquipmentRoutes } from '../equipment/routes.ts';
import { createExerciseRoutes } from '../exercise/routes.ts';
import { createMuscleRoutes } from '../muscle/routes.ts';
import { createUserRoutes } from '../user/routes.ts';
import { createAuthRepository } from '../auth/repository.ts';
import { createUserRepository } from '../user/repository.ts';
import { createActivityRepository } from '../activity/repository.ts';
import { createExerciseRepository } from '../exercise/repository.ts';
import { createEquipmentRepository } from '../equipment/repository.ts';
import { createMuscleRepository } from '../muscle/repository.ts';
import { createAuthService } from '../auth/service.ts';
import { createUserService } from '../user/service.ts';
import { createActivityService } from '../activity/service.ts';
import { createExerciseService } from '../exercise/service.ts';
import { createEquipmentService } from '../equipment/service.ts';
import { createMuscleService } from '../muscle/service.ts';

export function createRoutes(fastify: FastifyInstance) {
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

  const OPTIONS = { prefix: '/api' };

  fastify.register(createAuthRoutes({ authService }), OPTIONS);
  fastify.register(createUserRoutes({ userService }), OPTIONS);
  fastify.register(createActivityRoutes({ activityService }), OPTIONS);
  fastify.register(createExerciseRoutes({ exerciseService }), OPTIONS);
  fastify.register(createEquipmentRoutes({ equipmentService }), OPTIONS);
  fastify.register(createMuscleRoutes({ muscleService }), OPTIONS);
}
