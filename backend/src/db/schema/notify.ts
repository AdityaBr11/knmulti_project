import { Schema } from "mongoose";

interface INotify {
  notifyHead: string;
  notifyBody: string;
  notifyDate: Date;
  unseenNotify: Boolean;
  createdBy: number;
}

const notifySchema = new Schema<INotify>(
  {
    notifyHead: { type: String, required: true },
    notifyBody: { type: String, required: true },
    notifyDate: {
      type: Date,
      default: new Date(),
    },
    unseenNotify: { type: Boolean, default: true },
    createdBy: { type: Number, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

export { notifySchema, INotify };
