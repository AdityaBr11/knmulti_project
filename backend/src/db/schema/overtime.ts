import { Schema } from "mongoose";

interface IOvertime {
  employee: number;
  date: Date;
  hours: number;
  description: string;
}

const overtimeSchema = new Schema<IOvertime>(
  {
    employee: {
      type: Number,
      ref: "Employee",
    },
    date: {
      type: Date,
      default: new Date(),
    },
    hours: Number,
    description: String,
  },
  {
    timestamps: true,
  }
);

export { overtimeSchema, IOvertime };
