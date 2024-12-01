import { Schema, model } from 'mongoose';
import type { IExercise } from 'fitness-tracker-contracts';

const exerciseSchema = new Schema<IExercise>(
  {
    title: { type: String, required: true, unique: true },
    weights: { type: [Number] },
    muscleGroups: [{ _id: String, title: String, icon: String }],
    defaultWeight: { type: Number },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('Exercise', exerciseSchema);
