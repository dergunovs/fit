import type { FastifyInstance } from 'fastify';

import { userModel } from '../user/schema.js';
import { tokenModel, authDataModel } from '../auth/schema.js';
import { exerciseModel, exerciseDoneModel, muscleGroupModel } from '../exercise/schema.js';
import { activityModel, activityStatisticsValuesModel } from '../activity/schema.js';
import { equipmentModel } from '../equipment/schema.js';

export function addSchemas(fastify: FastifyInstance) {
  fastify.addSchema(userModel);

  fastify.addSchema(tokenModel);
  fastify.addSchema(authDataModel);

  fastify.addSchema(exerciseModel);
  fastify.addSchema(exerciseDoneModel);
  fastify.addSchema(muscleGroupModel);

  fastify.addSchema(activityModel);
  fastify.addSchema(activityStatisticsValuesModel);

  fastify.addSchema(equipmentModel);
}
