import { model } from "mongoose";
import { ISplitStock, splitStockSchema } from "../db/schema/splitStock";

export const SplitStock = model<ISplitStock>("SplitStock", splitStockSchema);