import { model } from "mongoose";
import { IInvestment, investmentSchema } from "../db/schema/investment";

export const Investment = model<IInvestment>("Investment", investmentSchema);
