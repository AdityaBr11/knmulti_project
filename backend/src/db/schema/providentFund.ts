import { Document, Schema } from "mongoose";

interface IProvidentFund extends Document {
  employee: string;
  date: Date;
  type: string;
  amount: number;
  description: string;
}

const providentFundSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { providentFundSchema, IProvidentFund };
