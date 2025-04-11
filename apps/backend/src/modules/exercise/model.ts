import { Schema, model } from 'mongoose';
import type { IExercise } from 'fitness-tracker-contracts';

const exerciseSchema = new Schema<IExercise>(
  {
    title: { type: String, required: true },
    title_en: { type: String },
    description: { type: String },
    description_en: { type: String },
    muscles: [{ type: Schema.Types.ObjectId, ref: 'Muscle' }],
    isWeights: { type: Boolean },
    isWeightsRequired: { type: Boolean },
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
    equipmentForWeight: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
    isCustom: { type: Boolean },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false }
);

export default model('Exercise', exerciseSchema);
