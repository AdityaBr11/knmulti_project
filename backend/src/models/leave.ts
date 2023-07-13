import { model } from "mongoose";
import { Ileave, leaveSchema } from "../db/schema/leave";

export const Leave = model<Ileave>("Leave", leaveSchema);
