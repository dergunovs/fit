import { Schema, model } from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    dateLoggedIn: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
  },
  { versionKey: false }
);

export default model('User', userSchema);
