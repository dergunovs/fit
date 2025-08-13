import { Schema, model } from 'mongoose';
import type { IMuscle } from 'fitness-tracker-contracts';

const muscleSchema = new Schema<IMuscle>(
  {
    title: { type: String, required: true, unique: true },
    title_en: { type: String, unique: true },
    color: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('Muscle', muscleSchema);
