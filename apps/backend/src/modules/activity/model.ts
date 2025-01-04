import { Schema, model } from 'mongoose';
import type { IActivity } from 'fitness-tracker-contracts';

const activitySchema = new Schema<IActivity>(
  {
    exercises: {
      type: [
        {
          repeats: Number,
          exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
          duration: Number,
          isDone: Boolean,
          isToFailure: Boolean,
          weight: Number,
          dateCreated: { type: Date },
          dateUpdated: { type: Date },
        },
      ],
    },
    isDone: { type: Boolean, required: true },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false }
);

export default model('Activity', activitySchema);
