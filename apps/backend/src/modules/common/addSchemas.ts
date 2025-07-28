import type { FastifyInstance } from 'fastify';

import { userModel, userEquipmentModel, userPasswordModel, userFeedbackModel } from '../user/schema.js';
import { authDataModel, registerDataModel, confirmTokenDataModel, resetPasswordDataModel } from '../auth/schema.js';
import { exerciseModel, exerciseDoneModel } from '../exercise/schema.js';
import { activityModel, activityStatisticsValuesModel } from '../activity/schema.js';
import { equipmentModel } from '../equipment/schema.js';
import { muscleModel } from '../muscle/schema.js';

const schemas = [
  authDataModel,
  registerDataModel,
  confirmTokenDataModel,
  resetPasswordDataModel,
  muscleModel,
  equipmentModel,
  exerciseModel,
  exerciseDoneModel,
  activityModel,
  activityStatisticsValuesModel,
  userEquipmentModel,
  userPasswordModel,
  userFeedbackModel,
  userModel,
];

export function addSchemas(fastify: FastifyInstance) {
  schemas.forEach((schema) => fastify.addSchema(schema));
}
