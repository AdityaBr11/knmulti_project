
import { model } from "mongoose";
import { IVendorBill, vendorBillSchema } from "../db/schema/vendorBill";

export const VendorBill = model<IVendorBill>("VendorBill", vendorBillSchema);