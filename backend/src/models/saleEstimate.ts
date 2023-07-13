import { model } from "mongoose";
import { ISaleEstimate, saleEstimateSchema } from "../db/schema/saleEstimate";

export const SaleEstimate = model<ISaleEstimate>(
  "SaleEstimate",
  saleEstimateSchema
);
