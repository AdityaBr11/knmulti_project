import { model } from "mongoose";
import { ITransferStock, transferStockSchema } from "../db/schema/transferStock";

export const TransferStock = model<ITransferStock>("TransferStock", transferStockSchema);