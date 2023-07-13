import { Schema, Types } from "mongoose";

interface IPolicy extends Document {
  name: string;
  description: string;
  department: Types.ObjectId;
  createdAt: Date;
}

const policySchema = new Schema<IPolicy>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

export { IPolicy, policySchema };
