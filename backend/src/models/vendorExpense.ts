import { model } from "mongoose";
import { IVendorExpense, vendorExpenseSchema } from "../db/schema/vendorExpense";

export const VendorExpense = model<IVendorExpense>('VendorExpense', vendorExpenseSchema);
