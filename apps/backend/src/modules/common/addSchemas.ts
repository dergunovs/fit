import type { FastifyInstance } from 'fastify';

import { userModel, userEquipmentModel, userPasswordModel } from '../user/schema.js';
import { authDataModel, registerDataModel, confirmTokenDataModel, resetPasswordDataModel } from '../auth/schema.js';
import { exerciseModel, exerciseDoneModel } from '../exercise/schema.js';
import { activityModel, activityStatisticsValuesModel } from '../activity/schema.js';
import { equipmentModel } from '../equipment/schema.js';
import { muscleModel } from '../muscle/schema.js';

export function addSchemas(fastify: FastifyInstance) {
  fastify.addSchema(userEquipmentModel);
  fastify.addSchema(userPasswordModel);
  fastify.addSchema(userModel);

  fastify.addSchema(authDataModel);
  fastify.addSchema(registerDataModel);
  fastify.addSchema(confirmTokenDataModel);
  fastify.addSchema(resetPasswordDataModel);

  fastify.addSchema(muscleModel);

  fastify.addSchema(exerciseModel);
  fastify.addSchema(exerciseDoneModel);

  fastify.addSchema(activityModel);
  fastify.addSchema(activityStatisticsValuesModel);

  fastify.addSchema(equipmentModel);
}
