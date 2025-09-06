import type { FastifyInstance } from 'fastify';

import {
  userTemplateModel,
  userModel,
  userEquipmentModel,
  userPasswordModel,
  userFeedbackModel,
} from '../user/schema.js';
import { authDataModel, registerDataModel, confirmTokenDataModel, resetPasswordDataModel } from '../auth/schema.js';
import { exerciseModel, exerciseDoneModel, exerciseChoosenModel } from '../exercise/schema.js';
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
  exerciseChoosenModel,
  exerciseDoneModel,
  activityModel,
  activityStatisticsValuesModel,
  userTemplateModel,
  userEquipmentModel,
  userPasswordModel,
  userFeedbackModel,
  userModel,
];

export function addSchemas(fastify: FastifyInstance) {
  schemas.forEach((schema) => fastify.addSchema(schema));
}
