import { Schema, model } from 'mongoose';
import type { IEquipment } from 'fitness-tracker-contracts';

const equipmentSchema = new Schema<IEquipment>(
  {
    title: { type: String, required: true, unique: true },
    weights: { type: [Number] },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('Equipment', equipmentSchema);
