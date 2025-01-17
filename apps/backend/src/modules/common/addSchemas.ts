import type { FastifyInstance } from 'fastify';

import { userModel, userEquipmentModel } from '../user/schema.js';
import { authDataModel } from '../auth/schema.js';
import { exerciseModel, exerciseDoneModel, muscleGroupModel } from '../exercise/schema.js';
import { activityModel, activityStatisticsValuesModel } from '../activity/schema.js';
import { equipmentModel } from '../equipment/schema.js';

export function addSchemas(fastify: FastifyInstance) {
  fastify.addSchema(userEquipmentModel);
  fastify.addSchema(userModel);

  fastify.addSchema(authDataModel);

  fastify.addSchema(exerciseModel);
  fastify.addSchema(exerciseDoneModel);
  fastify.addSchema(muscleGroupModel);

  fastify.addSchema(activityModel);
  fastify.addSchema(activityStatisticsValuesModel);

  fastify.addSchema(equipmentModel);
}
