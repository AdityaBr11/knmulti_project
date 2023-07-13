import { Document, Schema } from "mongoose";

interface IGoalType extends Document {
  name: string;
  description: string;
  status: string;
}

const goalTypeSchema = new Schema<IGoalType>(
  {
    name: {
      type: String,
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

export { IGoalType, goalTypeSchema };
