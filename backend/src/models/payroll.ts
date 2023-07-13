import { model } from "mongoose";
import { IPayroll, payrollSchema } from "../db/schema/payroll";

export const Payroll = model<IPayroll>("Payroll", payrollSchema);