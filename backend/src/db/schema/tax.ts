import { Document, Schema } from "mongoose";

interface ITax extends Document {
  name: string;
  type: string;
  amount: number;
  status: boolean;
}

const taxSchema = new Schema<ITax>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { taxSchema, ITax };
