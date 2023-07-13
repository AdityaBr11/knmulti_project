import { model } from "mongoose";
import { goalSchema, IGoal } from "../db/schema/goal";

export const Goal = model<IGoal>("Goal", goalSchema);
