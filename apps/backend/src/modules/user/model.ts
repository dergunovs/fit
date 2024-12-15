import { Schema, model } from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String },
    password: { type: String, required: true },
    dateLoggedIn: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('User', userSchema);
