import { Document, Schema } from "mongoose";

interface IEmployeeType extends Document {
  employeeTypeName: string;
  employeeTypeDescription: string;
  noOfLeaves: number;
}

const employeeTypeSchema = new Schema<IEmployeeType>(
  {
    employeeTypeName: String,
    employeeTypeDescription: String,
    noOfLeaves: Number,
  },
  {
    timestamps: true,
  }
);

export { IEmployeeType, employeeTypeSchema };
