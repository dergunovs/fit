import { Schema, model } from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('User', userSchema);
