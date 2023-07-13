import { model } from "mongoose";
import { ISalePayment, salePaymentSchema } from "../db/schema/salePayment";

export const SalePayment = model<ISalePayment>(
  "SalePayment",
  salePaymentSchema
);
