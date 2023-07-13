import { Document, Schema, Types } from "mongoose";

interface IApproval extends Document {
  type: string;
  leave?: Types.ObjectId;
  timesheet?: Types.ObjectId;
  resignation?: Types.ObjectId;
  status: boolean;
}

const approvalSchema = new Schema<IApproval>(
  {
    type: String,
    leave: { type: Schema.Types.ObjectId, ref: "Leave" },
    timesheet: { type: Schema.Types.ObjectId, ref: "Timesheet" },
    resignation: { type: Schema.Types.ObjectId, ref: "Resignation" },
    status: Boolean,
  },
  {
    timestamps: true,
  }
);

export { IApproval, approvalSchema };
