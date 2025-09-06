import { Schema, model } from 'mongoose';
import type { IUser } from 'fitness-tracker-contracts';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
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
    templates: {
      type: [
        {
          title: { type: String },
          exercises: {
            type: [
              {
                exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
                repeats: Number,
                weight: Number,
              },
            ],
          },
        },
      ],
    },
    defaultWeights: { type: Object },
    dateLoggedIn: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
    isEmailConfirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
    goalActivities: { type: Number, default: 2 },
    goalSets: { type: Number, default: 24 },
    goalRepeats: { type: Number, default: 12 },
    goalDuration: { type: Number, default: 40 },
  },
  { versionKey: false }
);

userSchema.index({ role: 1 });

export default model('User', userSchema);
