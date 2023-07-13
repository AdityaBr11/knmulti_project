import { model } from "mongoose";
import { IVendorBillPayment, vendorBillPaymentSchema } from "../db/schema/vendorBillPayment";

export const VendorBillPayment = model<IVendorBillPayment>("VendorBillPayment", vendorBillPaymentSchema);