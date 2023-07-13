import { model } from "mongoose";
import { IPurchaseOrder, purchaseOrderSchema } from "../db/schema/purchaseOrder";

export const PurchaseOrder = model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema);