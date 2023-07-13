import { model } from "mongoose";
import { ITimesheet, timesheetSchema } from "../db/schema/timesheet";

export const Timesheet = model<ITimesheet>("Timesheet", timesheetSchema);
