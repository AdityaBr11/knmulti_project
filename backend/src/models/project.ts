import { model } from "mongoose";
import { IProject, projectSchema } from "../db/schema/project";

export const Project = model<IProject>("Project", projectSchema);
