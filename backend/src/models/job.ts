import { model } from "mongoose";
import { jobSchema } from "../db/schema/job";

export const Job = model("Job", jobSchema);
