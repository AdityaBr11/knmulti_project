import { model } from "mongoose";
import { IRecurringInvoice, recurringInvoiceSchema } from "../db/schema/recurringInvoice";

export const RecurringInvoice = model<IRecurringInvoice>(
  "RecurringInvoice",
  recurringInvoiceSchema
);
