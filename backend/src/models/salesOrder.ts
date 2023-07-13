import { model } from "mongoose";
import { ISalesOrder, salesOrderSchema } from "../db/schema/salesOrder";

export const SalesOrder = model<ISalesOrder>(
  "SalesOrder",
  salesOrderSchema
);
