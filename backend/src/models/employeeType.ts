import { model } from "mongoose";
import { employeeTypeSchema } from "../db/schema/employeeTypes";

export const EmployeeType = model("EmployeeType", employeeTypeSchema);
