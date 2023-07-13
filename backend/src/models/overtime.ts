import { model } from "mongoose";
import { overtimeSchema } from "../db/schema/overtime";

export const Overtime = model("Overtime", overtimeSchema);
