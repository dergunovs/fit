import { Schema, model } from 'mongoose';
import type { IEquipment } from 'fitness-tracker-contracts';

const equipmentSchema = new Schema<IEquipment>(
  {
    title: { type: String, required: true, unique: true },
    title_en: { type: String, unique: true },
    isWeights: { type: Boolean },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

equipmentSchema.index({ title: 1 });
equipmentSchema.index({ title_en: 1 });

export default model('Equipment', equipmentSchema);
