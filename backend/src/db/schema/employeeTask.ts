import { Document, Schema } from "mongoose";

interface IEmployeeTask extends Document {
  id: number;  
  title: string;
  start: Date;
  end: Date;
}

const employeeTaskSchema = new Schema<IEmployeeTask>(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export { IEmployeeTask, employeeTaskSchema };
