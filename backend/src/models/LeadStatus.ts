import { model } from "mongoose";
import { ILeadStatus, leadStatusSchema } from "../db/schema/leadStatus";

export const LeadStatus = model<ILeadStatus>("LeadStatus", leadStatusSchema);
