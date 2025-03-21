import { Schema, model } from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['admin', 'user'] },
    password: { type: String, required: true },
    passwordTemporary: { type: String },
    isResetPassword: { type: Boolean, default: false },
    equipments: {
      type: [
        {
          equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
          weights: [Number],
        },
      ],
    },
    defaultWeights: { type: Object },
    dateLoggedIn: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
    isEmailConfirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
  },
  { versionKey: false }
);

export default model('User', userSchema);
