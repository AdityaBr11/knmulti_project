import { Schema, Types } from "mongoose";

interface IResignation extends Document {
  employee: Types.ObjectId;
  reason: string;
  date: Date;
  appprovedBy: Types.ObjectId;
  approvedDate: Date;
  approved: boolean;
}

const resignationSchema = new Schema<IResignation>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    reason: String,
    date: Date,
    appprovedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    approvedDate: Date,
    approved: Boolean,
  },
  {
    timestamps: true,
  }
);

export { IResignation, resignationSchema };
