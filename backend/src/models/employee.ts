import { model } from "mongoose";
import { employeeSchema, IEmployee } from "../db/schema/employee";

export const Employee = model<IEmployee>("Employee", employeeSchema);
