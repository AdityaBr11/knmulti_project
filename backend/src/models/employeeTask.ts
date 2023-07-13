import { model } from "mongoose";
import { employeeTaskSchema, IEmployeeTask } from "../db/schema/employeeTask";

export const EmployeeTask = model<IEmployeeTask>("EmployeeTask", employeeTaskSchema);