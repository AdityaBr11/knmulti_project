import { model } from "mongoose";
import { ITax, taxSchema } from "../db/schema/tax";

export const Tax = model<ITax>("Tax", taxSchema);
