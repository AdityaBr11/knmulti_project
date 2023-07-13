import { Document, Schema, Types } from "mongoose";
import { USER_AUTHORITIES } from "../../constants";

interface IRole extends Document {
  name: string;
  description: string;
  department: Types.ObjectId;
  active: boolean;
  authorities: USER_AUTHORITIES[];
  createdBy: Types.ObjectId;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type : String, default: "Employee" },
    description: String,
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    active: Boolean,
    authorities: [{ type: String, enum: Object.values(USER_AUTHORITIES) }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

export { IRole, roleSchema };
