import { model } from "mongoose";
import { ITask, taskSchema } from "../db/schema/task";

export const Task = model<ITask>("Task", taskSchema);
