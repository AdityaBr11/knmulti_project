import { model } from "mongoose";
import {
  IProvidentFund,
  providentFundSchema,
} from "../db/schema/providentFund";

export const ProvidentFund = model<IProvidentFund>(
  "ProvidentFund",
  providentFundSchema
);
