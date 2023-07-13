import { Schema } from "mongoose";

interface ITermintion extends Document {
  employee: number;
  reason: string;
  terminationDate: Date;
  noticePeriod: number;
}

const terminationSchema = new Schema<ITermintion>(
  {
    employee: { type: Number, ref: "Employee" },
    reason: String,
    terminationDate: Date,
    noticePeriod: Number,
  },
  {
    timestamps: true,
  }
);

export { ITermintion, terminationSchema };
