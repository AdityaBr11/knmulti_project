import { model } from "mongoose";
import { ILead, leadSchema } from "../db/schema/leads";

export const Lead = model<ILead>("Lead", leadSchema);
