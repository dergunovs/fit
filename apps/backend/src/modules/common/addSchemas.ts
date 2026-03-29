import type { FastifyInstance } from 'fastify';

import {
  userTemplateModel,
  userModel,
  userEquipmentModel,
  userPasswordModel,
  userFeedbackModel,
} from '../user/schema.ts';
import { authDataModel, registerDataModel, confirmTokenDataModel, resetPasswordDataModel } from '../auth/schema.ts';
import { exerciseModel, exerciseDoneModel, exerciseChoosenModel } from '../exercise/schema.ts';
import { activityModel, activityStatisticsValuesModel } from '../activity/schema.ts';
import { equipmentModel } from '../equipment/schema.ts';
import { muscleModel } from '../muscle/schema.ts';

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
