import { Document, Schema } from "mongoose";

interface IInvestment extends Document {
  name: string;
  for: string;
  date: Date;
  amount: number;
  paidBy: string;
}

const investmentSchema = new Schema<IInvestment>(
  {
    name: {
      type: String,
      required: true,
    },
    for: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { IInvestment, investmentSchema };
