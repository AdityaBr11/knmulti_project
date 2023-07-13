import { Document, Schema, Types } from "mongoose";

interface IGoal extends Document {
  goalType: Types.ObjectId;
  subject: string;
  targetAchievement: string;
  startDate: Date;
  endDate: Date;
  description: string;
  status: string;
}

const goalSchema = new Schema<IGoal>(
  {
    goalType: {
      type: Schema.Types.ObjectId,
      ref: "GoalType",
    },
    subject: {
      type: String,
      required: true,
    },
    targetAchievement: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { IGoal, goalSchema };
