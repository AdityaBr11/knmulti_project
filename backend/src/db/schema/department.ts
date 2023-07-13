import { Document, Schema } from "mongoose";

interface IDepartment extends Document {
  name: string;
  active: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: String,
    active: Boolean,
  },
  {
    timestamps: true,
  }
);

export { IDepartment, departmentSchema };
