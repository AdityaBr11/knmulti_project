import { model } from "mongoose";
import { departmentSchema, IDepartment } from "../db/schema/department";

export const Department = model<IDepartment>("Department", departmentSchema);
