import { Document, Schema } from "mongoose";

interface ILeaveType extends Document {
  leaveTypeName: string;
  leaveTypeDescription: string;
  noOfLeaves: number;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    leaveTypeName: String,
    leaveTypeDescription: String,
    noOfLeaves: Number,
  },
  {
    timestamps: true,
  }
);

export { ILeaveType, leaveTypeSchema };
