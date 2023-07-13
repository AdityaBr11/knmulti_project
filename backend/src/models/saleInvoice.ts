import { model } from "mongoose";
import { ISaleInvoice, saleInvoiceSchema } from "../db/schema/saleInvoice";

export const SaleInvoice = model<ISaleInvoice>(
  "SaleInvoice",
  saleInvoiceSchema
);
