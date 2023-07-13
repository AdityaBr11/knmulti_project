import { model } from "mongoose";
import { leaveTypeSchema } from "../db/schema/leaveTypes";

export const LeaveType = model("LeaveType", leaveTypeSchema);
