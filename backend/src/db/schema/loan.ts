import { Document, Schema } from "mongoose";
import { LOAN_STATUS } from "../../constants";

interface ILoan extends Document {
  for: string;
  date: Date;
  amount: number;
  paidBy: string;
  status: LOAN_STATUS;
  employee: Schema.Types.ObjectId;
}

const loanSchema = new Schema<ILoan>({
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
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(LOAN_STATUS),
  },
});

export { loanSchema, ILoan };
