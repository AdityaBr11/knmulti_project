import { model } from "mongoose";
import { IStock, stockSchema } from "../db/schema/stock";

export const Stock = model<IStock>("Stock", stockSchema);