import { model } from "mongoose";
import { goalTypeSchema, IGoalType } from "../db/schema/goalType";

export const GoalType = model<IGoalType>("GoalType", goalTypeSchema);
